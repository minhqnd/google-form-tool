// content.js - Extract questions and options from Google Form, then send to Gemini API

const GEMINI_API_KEY = 'api_gemini'; // Replace with your actual API key

async function sendToGemini(question, options) {
  const prompt = `Câu hỏi: ${question}\nTùy chọn: ${options.join(', ')}\nHãy chọn đáp án đúng và giải thích ngắn gọn.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseJsonSchema: {
          type: 'object',
          properties: {
            answer: { type: 'string', description: 'Đáp án đúng' },
            explanation: { type: 'string', description: 'Giải thích ngắn gọn' }
          },
          required: ['answer', 'explanation']
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function processQuestion(container, index) {
  // Find the question title
  const questionElement = container.querySelector('span.M7eMe');
  if (questionElement) {
    const questionText = questionElement.textContent.trim();
    console.log(`Processing Question ${index + 1}: ${questionText}`);
    
    // Find all options within this container
    const optionElements = container.querySelectorAll('span.aDTYNe.snByac.OvPDhc.OIC90c');
    const options = Array.from(optionElements).map(opt => opt.textContent.trim());
    
    if (options.length > 0) {
      console.log('  Options:', options);
      
      // Send to Gemini API
      try {
        const geminiResponse = await sendToGemini(questionText, options);
        console.log('  Gemini Response:', geminiResponse);
        
        // Parse the response
        const parsedResponse = JSON.parse(geminiResponse);
        const correctAnswer = parsedResponse.answer.trim();
        console.log('  Correct Answer:', correctAnswer);
        
        // Find and click the correct option
        const optionDivs = container.querySelectorAll('.Od2TWd.hYsg7c');
        for (const div of optionDivs) {
          const dataValue = div.getAttribute('data-value');
          const ariaLabel = div.getAttribute('aria-label');
          if (dataValue === correctAnswer || ariaLabel === correctAnswer) {
            div.click();
            console.log('  Clicked on:', correctAnswer);
            break;
          }
        }
      } catch (error) {
        console.error('  Error calling Gemini API:', error);
      }
    } else {
      console.log('  (No options found)');
    }
    console.log('---');
  }
}

function setupEventListeners() {
  // Find all question title divs
  const questionTitles = document.querySelectorAll('.HoXoMd.D1wxyf.RjsPE[role="heading"][aria-level="3"]');
  
  questionTitles.forEach((titleDiv, index) => {
    titleDiv.addEventListener('click', async () => {
      // Find the container
      const container = titleDiv.closest('.Qr7Oae[role="listitem"]');
      if (container) {
        await processQuestion(container, index);
      }
    });
  });
}

// Run when the page is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupEventListeners);
} else {
  setupEventListeners();
}