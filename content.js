// content.js - Extract questions and options from Google Form, then send to Gemini API

let GEMINI_API_KEY = ''; // Default, will be overridden

// Load API key from storage
chrome.storage.sync.get(['apiKey'], (result) => {
  if (result.apiKey) {
    GEMINI_API_KEY = result.apiKey;
  }
});

// Selectors
const QUESTION_TITLE_SELECTOR = 'span.M7eMe';
const OPTION_DIVS_SELECTOR = '.Od2TWd.hYsg7c, .uVccjd.aiSeRd.FXLARc.wGQFbe.BJHAP.oLlshd';
const MULTIPLE_CHECK_SELECTOR = '.uVccjd.aiSeRd.FXLARc.wGQFbe.BJHAP.oLlshd';
const INPUT_SELECTOR = 'input.whsOnd.zHQkBf';
const TEXTAREA_SELECTOR = 'textarea.KHxj8b.tL9Q4c';
const TITLE_DIVS_SELECTOR = '.HoXoMd.D1wxyf.RjsPE[role="heading"][aria-level="3"]';
const CONTAINER_SELECTOR = '.Qr7Oae[role="listitem"]';

// Helper: Get question text
function getQuestionText(container) {
  const el = container.querySelector(QUESTION_TITLE_SELECTOR);
  return el ? el.textContent.trim() : '';
}

// Helper: Detect question type
function detectType(container) {
  return container.querySelectorAll(OPTION_DIVS_SELECTOR).length > 0 ? 'choice' : 'text';
}

// Helper: Check if multiple choice
function isMultipleChoice(container) {
  return container.querySelectorAll(MULTIPLE_CHECK_SELECTOR).length > 0;
}

// Helper: Get options
function getOptions(container) {
  return Array.from(container.querySelectorAll(OPTION_DIVS_SELECTOR)).map(div => {
    const span = div.querySelector('span.aDTYNe');
    return span ? span.textContent.trim() : (div.getAttribute('aria-label') || div.getAttribute('data-value') || '');
  }).filter(Boolean);
}

// Helper: Send to Gemini for choice questions
async function sendToGeminiChoice(question, options) {
  const prompt = `Câu hỏi: ${question}\nTùy chọn: ${options.join(', ')}\nHãy chọn đáp án đúng và giải thích ngắn gọn.`;
  const schema = {
    type: 'object',
    properties: {
      answer: { type: 'string', description: 'Đáp án đúng' },
      explanation: { type: 'string', description: 'Giải thích ngắn gọn' }
    },
    required: ['answer', 'explanation']
  };
  return await sendToGemini(prompt, schema);
}

// Helper: Send to Gemini for text questions
async function sendToGeminiText(question) {
  const prompt = `${question}\nHãy trả lời ngắn gọn.`;
  const schema = {
    type: 'object',
    properties: {
      answer: { type: 'string', description: 'Đáp án' }
    },
    required: ['answer']
  };
  return await sendToGemini(prompt, schema);
}

// Helper: Generic send to Gemini
async function sendToGemini(prompt, schema) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseJsonSchema: schema
      }
    })
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  return JSON.parse(data.candidates[0].content.parts[0].text);
}

// Helper: Parse answers
function parseAnswers(answer, isMultiple) {
  return isMultiple ? answer.split(',').map(a => a.trim()) : [answer.trim()];
}

// Helper: Click options
function clickOptions(container, answers) {
  const optionDivs = container.querySelectorAll(OPTION_DIVS_SELECTOR);
  answers.forEach(answer => {
    for (const div of optionDivs) {
      const dataValue = div.getAttribute('data-value') || div.getAttribute('data-answer-value');
      const ariaLabel = div.getAttribute('aria-label');
      const spanText = div.querySelector('span.aDTYNe')?.textContent.trim();
      if (dataValue === answer || ariaLabel === answer || spanText === answer) {
        div.click();
        console.log('  Clicked on:', answer);
        break;
      }
    }
  });
}

// Helper: Fill text input
function fillText(container, answer) {
  const input = container.querySelector(INPUT_SELECTOR);
  const textarea = container.querySelector(TEXTAREA_SELECTOR);
  if (input) {
    input.value = answer;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('  Filled input with:', answer);
  } else if (textarea) {
    textarea.value = answer;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('  Filled textarea with:', answer);
  }
}

// Main: Process question
async function processQuestion(container, index) {
  const questionText = getQuestionText(container);
  if (!questionText) return;
  
  console.log(`Processing Question ${index + 1}: ${questionText}`);
  
  const type = detectType(container);
  if (type === 'choice') {
    const options = getOptions(container);
    const isMultiple = isMultipleChoice(container);
    console.log('  Options:', options);
    console.log('  Is Multiple Choice:', isMultiple);
    
    try {
      const response = await sendToGeminiChoice(questionText, options);
      console.log('  Gemini Response:', response);
      const answers = parseAnswers(response.answer, isMultiple);
      console.log('  Answers to select:', answers);
      clickOptions(container, answers);
    } catch (error) {
      console.error('  Error:', error);
    }
  } else {
    console.log('  (Text input detected)');
    try {
      const response = await sendToGeminiText(questionText);
      console.log('  Gemini Response:', response);
      fillText(container, response.answer);
    } catch (error) {
      console.error('  Error:', error);
    }
  }
  console.log('---');
}

// Process all questions
async function processAllQuestions() {
  const containers = document.querySelectorAll(CONTAINER_SELECTOR);
  for (let i = 0; i < containers.length; i++) {
    await processQuestion(containers[i], i);
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'solveAll') {
    processAllQuestions();
  }
});

// Setup event listeners
function setupEventListeners() {
  document.querySelectorAll(TITLE_DIVS_SELECTOR).forEach((titleDiv, index) => {
    titleDiv.addEventListener('click', async () => {
      const container = titleDiv.closest(CONTAINER_SELECTOR);
      if (container) await processQuestion(container, index);
    });
  });
}

// Init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupEventListeners);
} else {
  setupEventListeners();
}