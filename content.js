// content.js - Extract questions and options from Google Form, then send to Gemini API

const GEMINI_API_KEY = 'AIzaSyD1v1RYEGcuqIB6Z0D9bf5DYeit1INl5RU'; // Replace with your actual API key

async function sendToGemini(question, options) {
  const prompt = `Câu hỏi: ${question}\nTùy chọn: ${options.join(', ')}\nHãy chọn đáp án đúng và giải thích ngắn gọn.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`, {
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
    
    // Check for option divs (multiple choice or checkboxes)
    const optionDivs = container.querySelectorAll('.Od2TWd.hYsg7c, .uVccjd.aiSeRd.FXLARc.wGQFbe.BJHAP.oLlshd');
    if (optionDivs.length > 0) {
      // Multiple choice or checkboxes
      const options = Array.from(optionDivs).map(div => {
        const span = div.querySelector('span.aDTYNe');
        return span ? span.textContent.trim() : (div.getAttribute('aria-label') || div.getAttribute('data-value') || '');
      }).filter(opt => opt);
      console.log('  Options:', options);
      
      // Determine if multiple or single
      const isMultiple = container.querySelectorAll('.uVccjd.aiSeRd.FXLARc.wGQFbe.BJHAP.oLlshd').length > 0;
      console.log('  Is Multiple Choice:', isMultiple);
      
      // Send to Gemini API
      try {
        const geminiResponse = await sendToGemini(questionText, options);
        console.log('  Gemini Response:', geminiResponse);
        
        // Parse the response
        const parsedResponse = JSON.parse(geminiResponse);
        const correctAnswer = parsedResponse.answer.trim();
        console.log('  Correct Answer:', correctAnswer);
        
        // For multiple choice, split by comma and trim
        const answers = isMultiple ? correctAnswer.split(',').map(a => a.trim()) : [correctAnswer];
        console.log('  Answers to select:', answers);
        
        // Click the correct options
        for (const answer of answers) {
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
        }
      } catch (error) {
        console.error('  Error calling Gemini API:', error);
      }
    } else {
      // Short answer or long answer
      console.log('  (Text input detected)');
      
      // Send to Gemini API for answer
      try {
        const prompt = `${questionText}\nHãy trả lời ngắn gọn.`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`, {
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
                  answer: { type: 'string', description: 'Đáp án' }
                },
                required: ['answer']
              }
            }
          })
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const geminiResponse = data.candidates[0].content.parts[0].text;
        console.log('  Gemini Response:', geminiResponse);
        
        const parsedResponse = JSON.parse(geminiResponse);
        const answer = parsedResponse.answer.trim();
        console.log('  Answer:', answer);
        
        // Find input or textarea and set value
        const input = container.querySelector('input.whsOnd.zHQkBf');
        const textarea = container.querySelector('textarea.KHxj8b.tL9Q4c');
        if (input) {
          input.value = answer;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          console.log('  Filled input with:', answer);
        } else if (textarea) {
          textarea.value = answer;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          console.log('  Filled textarea with:', answer);
        }
      } catch (error) {
        console.error('  Error calling Gemini API:', error);
      }
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