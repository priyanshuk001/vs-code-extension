function transformArrayToString(input) {
  if (!input) return '';

  const normalizedInput = String(input).trim();

  // Handle integers
  if (isInteger(normalizedInput)) {
      return normalizedInput;
  }

  // Handle non-array strings
  if (!isArrayString(normalizedInput)) {
      return removeQuotes(normalizedInput);
  }

  // Attempt to parse array-like strings
  try {
      const parsedArray = parseArray(normalizedInput);
      return formatArray(parsedArray);
  } catch {
      // Fallback for invalid JSON or parsing errors
      return handleInvalidArray(normalizedInput);
  }
}

// Helper to check if a string is an integer
function isInteger(value) {
  return /^-?\d+$/.test(value);
}

// Helper to check if a string is an array-like string
function isArrayString(value) {
  return value.startsWith('[') && value.endsWith(']');
}

// Helper to remove quotes from a string
function removeQuotes(value) {
  return value.replace(/['"]/g, '').trim();
}

// Helper to parse an array-like string into a JavaScript array
function parseArray(value) {
  return JSON.parse(value.replace(/'/g, '"'));
}

// Helper to format an array into a string
function formatArray(array) {
  if (!Array.isArray(array)) {
      return removeQuotes(String(array));
  }

  return array
      .map(item => (item === null ? 'null' : removeQuotes(String(item))))
      .join(' ');
}

// Fallback handler for invalid JSON or malformed input
function handleInvalidArray(value) {
  return value
      .replace(/['"\[\]]/g, '') // Remove quotes and brackets
      .replace(/,/g, ' ')      // Replace commas with spaces
      .trim();
}

module.exports = {transformArrayToString};