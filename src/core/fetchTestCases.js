const {divideTestCases} = require('../basic/divideTestCases');
const {transformArrayToString} = require('../basic/transformArray');
const htmlParser = require('cheerio');




function parseTestCases(problemContent, examples, sampleCase) {
    if (!problemContent) return { inputs: [], outputs: [] };

    const dom = htmlParser.load(problemContent);
    const caseLineCount = calculateLineCount(sampleCase);
    const extractedInputs = examples ? divideTestCases(examples, caseLineCount) : [];
    const extractedOutputs = extractOutputsFromDOM(dom);

    return {
        inputs: formatInputs(extractedInputs),
        outputs: formatOutputs(extractedOutputs)
    };
}

// Helper to calculate the number of lines in a sample test case
function calculateLineCount(sampleCase) {
    return sampleCase ? (sampleCase.match(/\n/g) || []).length + 1 : 1;
}

// Extract outputs from the DOM
function extractOutputsFromDOM(dom) {
    const outputs = [];

    dom('strong.example').each((_, elem) => {
        let resultOutput = findOutputText(dom, dom(elem));
        outputs.push(resultOutput || '');
    });

    return outputs;
}

// Helper to find the output text for an example element
function findOutputText(dom, currentElem) {
    while (currentElem.length) {
        currentElem = getNextRelevantElement(dom, currentElem);

        if (!currentElem.length) break;

        const outputText = extractPreformattedText(currentElem);
        if (outputText) {
            const outputMatch = outputText.match(/Output:\s*([^]*?)(?=\nExplanation:|$)/);
            if (outputMatch && outputMatch[1]) {
                return transformArrayToString(outputMatch[1].trim());
            }
        }
    }
    return '';
}

// Helper to get the next relevant element in the DOM
function getNextRelevantElement(dom, element) {
    if (element.next().length) {
        return element.next();
    } else if (element.parent().next().length) {
        return element.parent().next();
    }
    return dom(); // Return an empty selection if no next element is found
}

// Extract text from a preformatted element
function extractPreformattedText(element) {
    const preElem = element.is('pre') ? element : element.find('pre');
    return preElem.length ? preElem.text() : null;
}

// Format extracted inputs
function formatInputs(inputs) {
    return inputs.map(input =>
        input.split('\n')
            .map(line => transformArrayToString(line))
            .join('\n')
    );
}

// Format extracted outputs
function formatOutputs(outputs) {
    return outputs.map(output =>
        output.split('\n')
            .map(line => transformArrayToString(line))
            .join('\n')
    );
}
module.exports = { parseTestCases };