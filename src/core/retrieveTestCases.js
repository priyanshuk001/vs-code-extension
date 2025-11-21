const httpClient = require('axios');
const{parseTestCases} = require('./fetchTestCases');

const FETCH_PROBLEM_QUERY = `
query fetchProblem($slug: String!) {
    question(titleSlug: $slug) {
        questionId
        title
        content
        exampleTestcases
        sampleTestCase
    }
}`;

async function retrieveTestCases(slug) {
  try {
      const apiResponse = await fetchProblemDetails(slug);
      const problemDetails = validateApiResponse(apiResponse);

      return formatProblemDetails(problemDetails);
  } catch (err) {
      throw new Error(`LeetCode API Error: ${err.message}`);
  }
}

// Helper to fetch problem details from the LeetCode API
async function fetchProblemDetails(slug) {
  const response = await httpClient.post('https://leetcode.com/graphql', {
      query: FETCH_PROBLEM_QUERY,
      variables: { slug }
  });

  return response.data;
}

// Helper to validate the API response
function validateApiResponse(apiResponse) {
  if (apiResponse.errors) {
      throw new Error(apiResponse.errors[0].message);
  }

  if (!apiResponse.data || !apiResponse.data.question) {
      throw new Error('Invalid API response: Missing question data');
  }

  return apiResponse.data.question;
}

// Helper to format the fetched problem details
function formatProblemDetails(problemDetails) {
  const { questionId, content, exampleTestcases, sampleTestCase } = problemDetails;

  return {
      id: questionId,
      content,
      testCases: parseTestCases(content, exampleTestcases, sampleTestCase)
  };
}

module.exports = { retrieveTestCases };
