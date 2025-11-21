const { generateWebviewStyles } = require('./theme');
const { generateWebviewjs } = require('./script');

class WebviewGenerator {
    constructor() {
        this.homeViewContent = this.generateHomeView();
        this.testCasesViewContent = this.generateTestCasesView();
    }

    generateHomeView() {
        return `
            <div id="homeView" class="active">
                <div class="input-group">
                    <h2>CPH-LeetCode Extension</h2>
                    <input type="text" 
                        id="leetcodeUrl" 
                        class="url-input" 
                        placeholder="Paste the problem URL here to fetch test cases">
                    <button id="fetchButton" 
                        class="fetch-button">
                        Fetch Test Cases
                    </button>
                </div>
            </div>
        `;
    }

    generateTestCasesView() {
        return `
            <div id="testCasesView">
                <div class="header">
                    <!-- Dynamic Header Content -->
                </div>
                <div class="problem-section">
                    <div class="problem-content" id="problemContent">
                        <!-- Problem content will be inserted here -->
                    </div>
                </div>
                <div id="testCasesContainer">
                    <!-- Test cases will be inserted here -->
                </div>
                <div class="new-buttons">
                    <button class="button add-testcase-button" id="addTestCase">
                        <span style="font-size: 10px;">+</span> New Test Case
                    </button>
                    <button class="new-problem-button" onclick="showView('homeView')">
                        <span style="font-size: 10px;">+</span> New Problem
                    </button>
                </div>
            </div>
        `;
    }

    generateHTML() {
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <style>${generateWebviewStyles()}</style>
                </head>
                <body>
                    <div class="container">
                        ${this.homeViewContent}
                        ${this.testCasesViewContent}
                    </div>
                    <script>
                        ${generateWebviewjs()}
                    </script>
                </body>
            </html>
        `;
    }
}

function generateWebviewHTML() {
    const webviewGenerator = new WebviewGenerator();
    return webviewGenerator.generateHTML();
}

module.exports = { generateWebviewHTML };
