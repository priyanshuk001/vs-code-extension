
function generateWebviewjs() {
  return `const vscode = acquireVsCodeApi();

                    
                    

                    function showView(viewId) {
                        document.querySelectorAll('.container > div').forEach(div => div.classList.remove('active'));
                        document.getElementById(viewId).classList.add('active');
                    }

                    function createTestCase(index, input = '', output = '') {
                        return \`
                            <div class="test-case" id="testcase-\${index}">
                                <div class="test-case-header" onclick="toggleTestCase(\${index})">
                                    <div class="test-case-summary">
                                        <span class="arrow">▼</span>
                                        <span>Testcase \${index + 1}</span>
                                        <span class="test-case-status" id="status-\${index}"></span>
                                    </div>
                                    <div class="test-case-actions" onclick="event.stopPropagation()">
                                        <button class="button run-button" onclick="runTestCase(\${index})">▶</button>
                                        <button class="button delete-button" onclick="deleteTestCase(\${index})">🗑️</button>
                                    </div>
                                </div>
                                <div class="test-case-content">
                                    <div class="input-section">
                                        <div class="section-header">
                                            <span>Input:</span>
                                            <button class="copy-button" onclick="copyText(this)">Copy</button>
                                        </div>
                                        <textarea class="input-box" oninput="autoResize(this)">\${input}</textarea>
                                    </div>
                                    <div class="output-section">
                                        <div class="section-header">
                                            <span>Expected Output:</span>
                                            <button class="copy-button" onclick="copyText(this)">Copy</button>
                                        </div>
                                        <textarea class="output-box" oninput="autoResize(this)">\${output}</textarea>
                                    </div>
                                    <div class="actual-output-section" id="actual-output-\${index}">
                                        <div class="section-header">
                                            <span>Actual Output:</span>
                                            <button class="copy-button" onclick="copyText(this)">Copy</button>
                                        </div>
                                        <textarea class="output-box actual-output" readonly></textarea>
                                    </div>
                                </div>
                            </div>
                        \`;
                    }
                    
                    function toggleTestCase(index) {
                        const testCase = document.getElementById(\`testcase-\${index}\`);
                        testCase.classList.toggle('collapsed');
                        
                    }

                    

                    function copyText(button) {
                        const textarea = button.parentElement.nextElementSibling;
                        navigator.clipboard.writeText(textarea.value);
                    }

                    function updateTestCaseStatus(index, passed, actualOutput) {
                        const testCase = document.getElementById(\`testcase-\${index}\`);
                        const statusElement = document.getElementById(\`status-\${index}\`);
                        const actualOutputSection = document.getElementById(\`actual-output-\${index}\`);
                        const actualOutputBox = actualOutputSection.querySelector('.actual-output');

                        statusElement.textContent = passed ? 'Passed✅' : 'Failed❌';
                        statusElement.className = \`test-case-status \${passed ? 'status-accepted' : 'status-wrong'}\`;

                        actualOutputBox.value = actualOutput;
                        actualOutputSection.classList.add('show');
                        autoResize(actualOutputBox);

                        // Expand the test case if it failed
                        if (!passed && testCase.classList.contains('collapsed')) {
                            testCase.classList.remove('collapsed');
                        }
                    }

                    function autoResize(textarea) {
                        textarea.style.height = 'auto';
                        textarea.style.height = textarea.scrollHeight + 'px';
                    }

                    function runTestCase(index) {
                        const testCase = document.getElementById(\`testcase-\${index}\`);
                        const input = testCase.querySelector('.input-box').value;
                        const expectedOutput = testCase.querySelector('.output-box').value;
                        
                        // Show loading state
                        const runButton = testCase.querySelector('.run-button');
                        const originalText = runButton.innerHTML;
                        runButton.innerHTML = '🕒';
                        runButton.disabled = true;

                        vscode.postMessage({
                            command: 'runSingle',
                            testCase: { input, expectedOutput, index }
                        });
                    }

                    function deleteTestCase(index) {
                        const testCase = document.getElementById(\`testcase-\${index}\`);
                        testCase.remove();
                    }
                   
                    const name=document.querySelector('.header')
                    document.getElementById('fetchButton').addEventListener('click', () => {
                        const url = document.getElementById('leetcodeUrl').value;
                       
                        vscode.postMessage({
                            command: 'fetch',
                            url: url
                        });
                          const flag=0
                         const parts = url.split('/').filter(part => part);
                         for(let i=0;i<parts.length;i++){
                         if(parts[i]==='description'){
                          name.innerHTML= parts[i-1].toUpperCase();
                          flag=1;
                            }
                            } 
                                if(flag===0){
                                name.innerHTML= parts[parts.length-1].toUpperCase();
                            }
                        });

                    

                    document.getElementById('addTestCase').addEventListener('click', () => {
                        const container = document.getElementById('testCasesContainer');
                        const currentCount = container.children.length;
                        const newTestCase = createTestCase(currentCount);
                        container.insertAdjacentHTML('beforeend', newTestCase);
                    });

                    window.addEventListener('message', event => {
                        const message = event.data;
                        switch (message.command) {
                            case 'showTestCases':
                                const container = document.getElementById('testCasesContainer');
                                container.innerHTML = message.testCases.inputs.map((input, index) => 
                                    createTestCase(index, input, message.testCases.outputs[index])
                                ).join('');
                                
                                if (message.problemContent) {
                                    const problemContentDiv = document.getElementById('problemContent');
                                    problemContentDiv.innerHTML = message.problemContent;
                                }
                                
                                showView('testCasesView');
                                break;
                            case 'testCaseResult':
                                const runButton = document.querySelector(\`#testcase-\${message.index} .run-button\`);
                                runButton.innerHTML = ' ▶ ';
                                runButton.disabled = false;
                                
                                updateTestCaseStatus(
                                    message.index,
                                    message.passed,
                                    message.actualOutput
                                );
                                break;
                        }
});`}

module.exports = { generateWebviewjs};