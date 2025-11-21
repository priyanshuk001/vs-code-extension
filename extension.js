const vscodeModule = require('vscode');
const{storeTestCases} = require('./src/core/storeTestCases');
const{processCode} = require('./src/basic/processCode');
const{retrieveTestCases} = require('./src/core/retrieveTestCases');

  const EventEmitter = require('events');
  class ProblemWebviewProvider {
    constructor() {
        this.activeWebview = null;
        this.activeFile = null;
        this.activeLang = null;
        this.commandEmitter = new EventEmitter();
        this.registerCommands();
    }

    resolveWebviewView(webviewView, context, token) {
        this.setupWebview(webviewView);
    }

    updateActiveFile(filePath, lang) {
        this.activeFile = filePath;
        this.activeLang = lang;
    }

    setupWebview(webviewInstance) {
        this.activeWebview = webviewInstance.webview;
        const { generateWebviewHTML } = require('./src/webview/main');

        webviewInstance.webview.options = {
            enableScripts: true
        };

        webviewInstance.webview.html = generateWebviewHTML();

        // Listen to messages from the webview
        webviewInstance.webview.onDidReceiveMessage((event) => {
            this.commandEmitter.emit(event.command, event);
        });
    }

    registerCommands() {
        const vscodeModule = require('vscode');
        const { executeSingleTest } = require('./src/basic/processCode');

        // Register the 'fetch' command
        this.commandEmitter.on('fetch', (event) => {
            vscodeModule.commands.executeCommand('leetcode-testcases.fetch', event.url);
        });

        // Register the 'runSingle' command
        this.commandEmitter.on('runSingle', async (event) => {
            try {
                if (!this.activeFile || !this.activeLang) {
                    throw new Error('No active file selected');
                }

                const result = await executeSingleTest(
                    this.activeFile,
                    this.activeLang,
                    event.testCase.input,
                    event.testCase.expectedOutput
                );

                if (!result.success) {
                    throw new Error(result.error);
                }

                this.activeWebview.postMessage({
                    command: 'testCaseResult',
                    index: event.testCase.index,
                    passed: result.passed,
                    actualOutput: result.actualOutput
                });
            } catch (err) {
                this.activeWebview.postMessage({
                    command: 'testCaseResult',
                    index: event.testCase.index,
                    passed: false,
                    actualOutput: err.message
                });
            }
        });
    }
}

function extractSlug(url) {
    try {
        const sanitizedUrl = url.replace(/\/$/, '');
        const slugMatch = sanitizedUrl.match(/\/problems\/([^/]+)/);
        if (!slugMatch || !slugMatch[1]) throw new Error('Invalid LeetCode URL');
        return slugMatch[1];
    } catch (err) {
        throw new Error('Invalid LeetCode URL format');
    }
}

function activateExtension(extensionContext) {
    const webviewProvider = new ProblemWebviewProvider();

    // Register Webview Provider
    registerWebviewProvider(extensionContext, webviewProvider);

    // Track Active Text Editor Changes
    trackActiveEditorChanges(webviewProvider);

    // Initialize Active File if Editor Exists
    initializeActiveFile(webviewProvider);

    // Register Commands
    const fetchCommand = createFetchCommand(extensionContext, webviewProvider);
    const runCommand = createRunCommand(extensionContext, webviewProvider);

    extensionContext.subscriptions.push(fetchCommand, runCommand);
    console.log('Extension activated successfully.');
}

// Helper to register the Webview View Provider
function registerWebviewProvider(extensionContext, webviewProvider) {
    const providerOptions = {
        webviewOptions: { retainContextWhenHidden: true }
    };

    extensionContext.subscriptions.push(
        vscodeModule.window.registerWebviewViewProvider(
            'leetcode-testcases.webview',
            webviewProvider,
            providerOptions
        )
    );
}

// Helper to track active text editor changes
function trackActiveEditorChanges(webviewProvider) {
    vscodeModule.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            updateWebviewActiveFile(webviewProvider, editor.document);
        }
    });
}

// Helper to initialize the active file if an editor exists
function initializeActiveFile(webviewProvider) {
    const activeEditor = vscodeModule.window.activeTextEditor;
    if (activeEditor) {
        updateWebviewActiveFile(webviewProvider, activeEditor.document);
    }
}

// Helper to update the active file and language in the webview provider
function updateWebviewActiveFile(webviewProvider, document) {
    const filePath = document.uri.fsPath;
    const docLang = document.languageId;
    webviewProvider.updateActiveFile(filePath, docLang);
}

// Create and return the Fetch command
function createFetchCommand(extensionContext, webviewProvider) {
    return vscodeModule.commands.registerCommand('leetcode-testcases.fetch', async problemUrl => {
        try {
            const workspaceRoot = getWorkspaceRoot();
            problemUrl = await getProblemUrl(problemUrl);
            if (!problemUrl) return;

            const slug = extractSlug(problemUrl);

            await showProgress("Fetching LeetCode test cases...", async () => {
                const { id, content, testCases } = await retrieveTestCases(slug);
                const savedPath = await storeTestCases(workspaceRoot, id, testCases);

                notifyWebview(webviewProvider, 'showTestCases', { testCases, problemContent: content, slug });
                await extensionContext.workspaceState.update('currentProblemId', id);
                vscodeModule.window.showInformationMessage(`Test cases saved to ${savedPath}`);
            });
        } catch (err) {
            vscodeModule.window.showErrorMessage(`Error: ${err.message}`);
        }
    });
}

// Create and return the Run command
function createRunCommand(extensionContext, webviewProvider) {
    return vscodeModule.commands.registerCommand('leetcode-testcases.run', async () => {
        try {
            const activeEditor = vscodeModule.window.activeTextEditor;
            if (!activeEditor) throw new Error('No active editor');

            const filePath = activeEditor.document.uri.fsPath;
            const language = getFileExtension(filePath);
            await activeEditor.document.save();

            const problemId = extensionContext.workspaceState.get('currentProblemId');
            if (!problemId) throw new Error('No problem ID found. Please fetch test cases first.');

            await showProgress("Running test cases...", async () => {
                const executionResult = await processCode(filePath, language, problemId);
                if (!executionResult.success) throw new Error(executionResult.error);

                notifyWebview(webviewProvider, 'testResults', {
                    results: executionResult.results,
                    summary: executionResult.summary
                });
            });
        } catch (err) {
            vscodeModule.window.showErrorMessage(`Error: ${err.message}`);
        }
    });
}

// Helper to get the workspace root
function getWorkspaceRoot() {
    const workspaceFolders = vscodeModule.workspace.workspaceFolders;
    if (!workspaceFolders || !workspaceFolders[0]) throw new Error('No workspace folder found');
    return workspaceFolders[0].uri.fsPath;
}

// Helper to get the problem URL
async function getProblemUrl(problemUrl) {
    if (!problemUrl) {
        return vscodeModule.window.showInputBox({
            prompt: 'Enter LeetCode problem URL',
            placeHolder: 'https://leetcode.com/problems/...'
        });
    }
    return problemUrl;
}

// Helper to extract file extension from file path
function getFileExtension(filePath) {
    // @ts-ignore
    return filePath.extname(filePath).substring(1);
}

// Helper to show a progress notification
async function showProgress(title, task) {
    await vscodeModule.window.withProgress({
        location: vscodeModule.ProgressLocation.Notification,
        title,
        cancellable: false
    }, task);
}

// Helper to send messages to the Webview
function notifyWebview(webviewProvider, command, data) {
    if (webviewProvider.activeWebview) {
        webviewProvider.activeWebview.postMessage({ command, ...data });
    }
}

function deactivateExtension() {}

module.exports = {
    activate: activateExtension,
    deactivate: deactivateExtension,
    
};
