function generateWebviewStyles() {
  return `
    .test-case-header {
        padding: 8px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #333;
    }
    .test-case-title {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #0098ff;
        cursor: pointer;
    }
    .test-case-actions {
        display: flex;
        gap: 8px;
    }
    .test-case-content {
        padding: 12px;
    }
    .input-section, .output-section {
        margin-bottom: 16px;
    }
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }
    .input-box, .output-box {
        background-color: #1e1e1e;
        border: 1px solid #333;
        padding: 8px;
        border-radius: 4px;
        min-height: 60px;
        width: 100%;
        box-sizing: border-box;
        color: #ffffff;
        font-family: monospace;
    }
    .button {
        padding: 8px 16px;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: bold;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }
    .run-button {
        background-color: #8ae33291;
        color: #ffffff;
        
    }
    .run-button:hover {
        background-color: #008763;
        transform: scale(1.05);
    }
    .delete-button {
        background-color:#eb244c91;
        color: #ffffff;
        
    }
    .delete-button:hover {
        background-color: #eb244c91;
        transform: scale(1.05);
    }
    .copy-button {
        background-color: #636e72;
        border-style: solid;
        border-color: #636e72;
        color: #ffffff;
        
    }
    .copy-button:hover {
        background-color: #2d3436;
        transform: scale(1.05);

    }


    .fetch-button {
        align-self: center;
        background-color: #0984e3;
        color: white;
        border: 2px solid #0652dd;
        padding: 8px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        height: 32px;
    }
    .fetch-button:hover {
        background-color: #0652dd;
        transform: scale(1.05);
    }
    
    .new-problem-button {
        background-color: #0984e3;
        color: white;
        border: 2px solid #0652dd;
        padding: 4px 12px;
        height: 24px;
        border-radius: 2px;
        margin-top: 12px;
        font-size: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        width: 100%;
        cursor: pointer;
        font-weight: bold;
}
    .new-buttons{
        
        display: flex;
        flex-direction: column;
        gap: 8px;
        
        
    }    

    body {
    background-color: var(--vscode-editor-background, #1a1a1a);
    color: var(--vscode-editor-foreground, #cccccc);
    font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, sans-serif);
    font-size: 13px;
    border: 1px solid var(--vscode-input-border);
    }
    .container {
        padding: 16px;
        height: 100vh;
        overflow-y: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    
    .input-group {
        display: flex;
        border-style: solid;
        border-width: 5px;
        padding:10px 10px;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 20px;
    }
    .header {
        font-size: 24px;
        margin-bottom: 20px;
    }
    .test-case {
        background-color: #252526;
        border-radius: 4px;
        margin-bottom: 16px;
    }
    .url-input {
        width: 100%;
        background-color: var(--vscode-input-background);
        border: 1px solid var(--vscode-input-border);
        color: var(--vscode-input-foreground);
        padding: 6px 8px;
        border-radius: 2px;
        height: 24px;
        font-size: 12px;
        box-sizing: border-box;
        margin-bottom:10px;
    }    
   
    
    
    #homeView, #testCasesView {
        display: none;
    }
    .active {
        display: block !important;
    }
    .test-case-status {
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: bold;
    }
    .status-accepted {
        
        color:  #8ae33291;
    }
    .status-wrong {
        color: #eb244c91;
    }
    .actual-output-section {
        margin-bottom: 16px;
        display: none;
    }
    .actual-output-section.show {
        display: block;
    }
    
    
    .collapsed .test-case-content {
        display: none;
    }
    .test-case-header .arrow {
        transition: transform 0.2s;
    }
    .collapsed .arrow {
        transform: rotate(180deg);
    }
    .test-case-summary {
        display: flex;
        align-items: center;
        color: #0984e3;
        gap: 8px;
    }
    

      .new-problem-button:hover {
          background-color: var(--vscode-button-hoverBackground);
      }
      .add-testcase-button {
          background-color: #8ae33291;;
          color: var(--vscode-button-foreground);
          border: 1px solid var(--vscode-button-border, #454545);
          padding: 4px 12px;
          height: 24px;
          border-radius: 2px;
          margin-top: 12px;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          width: 100%;
          cursor: pointer;
      }
      
      `
};

module.exports = { generateWebviewStyles };