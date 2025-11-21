const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');



const COMMANDS_FOR_LANGUAGES = {
  cpp: 'g++',
  python: 'python3'
  
};


async function processCode(fileLocation, lang, problemIdentifier, inputSet) {
    console.log(`Code execution initiated with:
    File: ${fileLocation}
    Language: ${lang}
    Problem Identifier: ${problemIdentifier}`);

    try {
        const fileExtension = path.extname(fileLocation);
        const baseFilename = path.basename(fileLocation, fileExtension);
        console.log(`Identified file - Extension: ${fileExtension}, Base name: ${baseFilename}`);

        const tempDirectory = path.join(__dirname, '../temp_storage');
        await fs.mkdir(tempDirectory, { recursive: true });
        console.log(`Temporary directory ensured at: ${tempDirectory}`);

        const tempFile = path.join(tempDirectory, `${baseFilename}${fileExtension}`);
        await fs.copyFile(fileLocation, tempFile);
        console.log(`File copied to temporary location: ${tempFile}`);

        const testResults = [];

        const testCaseLocation = path.join(__dirname, `../test_cases/${problemIdentifier}`);
        console.log(`Fetching test cases from: ${testCaseLocation}`);

        const availableFiles = await fs.readdir(testCaseLocation);
        const inputFiles = availableFiles.filter(file => file.startsWith('input_'));
        console.log(`Discovered ${inputFiles.length} test case(s)`);

        for (let index = 0; index < inputFiles.length; index++) {
            console.log(`\nExecuting test case ${index + 1}/${inputFiles.length}`);

            const inputFilePath = path.join(testCaseLocation, `input_${index + 1}.txt`);
            const expectedOutputPath = path.join(testCaseLocation, `output_${index + 1}.txt`);

            const inputContent = await fs.readFile(inputFilePath, 'utf-8');
            const expectedOutputContent = await fs.readFile(expectedOutputPath, 'utf-8').then(output => output.trim());

            console.log(`Input fetched from: ${inputFilePath}`);
            const outputGenerated = await executeCodeSnippet(tempFile, lang, inputContent);
            const actualOutput = outputGenerated.trim();

            const isSuccessful = actualOutput === expectedOutputContent;
            console.log(`Result for test case ${index + 1}: ${isSuccessful ? 'PASSED' : 'FAILED'}`);

            if (!isSuccessful) {
                console.log(`Expected: "${expectedOutputContent}"`);
                console.log(`Actual: "${actualOutput}"`);
            }

            testResults.push({
                testCase: index + 1,
                passed: isSuccessful,
                input: inputContent,
                expectedOutput: expectedOutputContent,
                actualOutput,
            });
        }

        await fs.unlink(tempFile);
        console.log(`\nTemporary file removed: ${tempFile}`);

        const testSummary = {
            total: testResults.length,
            passed: testResults.filter(result => result.passed).length,
        };

        console.log(`\nExecution completed. Summary: ${testSummary.passed}/${testSummary.total} tests passed`);

        return {
            success: true,
            results: testResults,
            summary: testSummary,
        };
    } catch (error) {
        console.error('Execution error:', error);
        return {
            success: false,
            error: error.message,
        };
    }
}


async function executeSingleTest(fileLocation, lang, testInput, expectedOutput) {
  console.log(`Single test execution initialized:
  File: ${fileLocation}
  Language: ${lang}
  Input: ${testInput}`);

  try {
      const fileExtension = path.extname(fileLocation);
      const baseFilename = path.basename(fileLocation, fileExtension);

      const tempDirectory = path.join(__dirname, '../temp_storage');
      await fs.mkdir(tempDirectory, { recursive: true });

      const tempFile = path.join(tempDirectory, `${baseFilename}${fileExtension}`);
      await fs.copyFile(fileLocation, tempFile);

      const executionOutput = await executeCodeSnippet(tempFile, lang, testInput);
      const actualOutput = executionOutput.trim();
      const isSuccessful = actualOutput === expectedOutput.trim();

      await fs.unlink(tempFile);

      return {
          success: true,
          passed: isSuccessful,
          actualOutput,
      };
  } catch (error) {
      console.error('Single test case execution error:', error);
      return {
          success: false,
          error: error.message,
      };
  }
}

function executeCodeSnippet(fileLocation, lang, testInput) {
  return new Promise((resolve, reject) => {
      let runCommand;

      switch (lang.toLowerCase()) {
          case 'cpp':
              const compiledFilePath = fileLocation.replace('.cpp', '');
              runCommand = `${COMMANDS_FOR_LANGUAGES.cpp} ${fileLocation} -o ${compiledFilePath} && ${compiledFilePath}`;
              break;
          case 'python':
              runCommand = `${COMMANDS_FOR_LANGUAGES.python} ${fileLocation}`;
              break;
          
          default:
              reject(new Error(`Unsupported language: ${lang}`));
              return;
      }

      console.log(`Command to execute: ${runCommand}`);

      const executionProcess = exec(runCommand, (err, stdout, stderr) => {
          if (err) {
              console.error('Execution failed:', err);
              console.error('stderr:', stderr);
              reject(new Error(stderr || err.message));
              return;
          }
          console.log('Execution successful');
          resolve(stdout);
      });

      if (testInput) {
          console.log('Providing test input');
          executionProcess.stdin.write(testInput);
          executionProcess.stdin.end();
      }
  });
}

module.exports = { executeSingleTest,processCode };
