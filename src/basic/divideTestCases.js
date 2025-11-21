function divideTestCases(testCasesString, caseLineCount) {
  if (!testCasesString) return [];

  const allLines = preprocessLines(testCasesString);
  return groupTestCases(allLines, caseLineCount);
}

// Helper to preprocess the input string into clean lines
function preprocessLines(input) {
  return input
      .split('\n')                // Split by line
      .map(line => line.trim())   // Trim whitespace
      .filter(line => line);      // Remove empty lines
}

// Helper to group lines into test cases based on caseLineCount
function groupTestCases(lines, caseLineCount) {
  const testCases = [];
  let currentTestCase = [];

  lines.forEach(line => {
      currentTestCase.push(line);

      if (currentTestCase.length === caseLineCount) {
          testCases.push(currentTestCase.join('\n'));
          currentTestCase = [];
      }
  });

  // Handle leftover lines if they don't complete a full test case
  if (currentTestCase.length > 0) {
      testCases.push(currentTestCase.join('\n'));
  }

  return testCases;
}

module.exports = {divideTestCases};