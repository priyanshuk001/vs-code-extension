const fileSystem = require('fs').promises;
const filePath = require('path');


async function storeTestCases(rootDir, problemIdentifier, testCases) {
    const testDir = filePath.join(rootDir, '.leetcode', 'testcases', problemIdentifier);

    try {
        await ensureDirectoryExists(testDir);
        await storeTestInputs(testDir, testCases.inputs);
        await storeTestOutputs(testDir, testCases.outputs);
        return testDir;
    } catch (err) {
        throw new Error(`Failed to store test cases: ${err.message}`);
    }
}

// Helper to ensure the test directory exists
async function ensureDirectoryExists(directory) {
    await fileSystem.mkdir(directory, { recursive: true });
}

// Helper to store test inputs
async function storeTestInputs(directory, inputs) {
    for (let idx = 0; idx < inputs.length; idx++) {
        const inputFile = filePath.join(directory, `input_${idx + 1}.txt`);
        const inputContent = Array.isArray(inputs[idx]) ? inputs[idx].join('\n') : inputs[idx];
        await fileSystem.writeFile(inputFile, inputContent);
    }
}

// Helper to store test outputs
async function storeTestOutputs(directory, outputs) {
    for (let idx = 0; idx < outputs.length; idx++) {
        const outputFile = filePath.join(directory, `output_${idx + 1}.txt`);
        await fileSystem.writeFile(outputFile, outputs[idx]);
    }
}

module.exports = { storeTestCases };
