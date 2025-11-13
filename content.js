// content.js - Extract questions and options from Google Form, then send to Gemini API

const GEMINI_API_KEY = 'AIzaSyD1v1RYEGcuqIB6Z0D9bf5DYeit1INl5RU'; // Replace with your actual API key

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

function extractFormData() {
  // Find all question containers (skip the first one which is the title)
  const questionContainers = document.querySelectorAll('.Qr7Oae[role="listitem"]');
  
  questionContainers.forEach(async (container, index) => {
    // Find the question title
    const questionElement = container.querySelector('span.M7eMe');
    if (questionElement) {
      const questionText = questionElement.textContent.trim();
      console.log(`Question ${index + 1}: ${questionText}`);
      
      // Find all options within this container
      const optionElements = container.querySelectorAll('span.aDTYNe.snByac.OvPDhc.OIC90c');
      const options = Array.from(optionElements).map(opt => opt.textContent.trim());
      
      if (options.length > 0) {
        console.log('  Options:', options);
        
        // Send to Gemini API
        try {
          const geminiResponse = await sendToGemini(questionText, options);
          console.log('  Gemini Response:', geminiResponse);
        } catch (error) {
          console.error('  Error calling Gemini API:', error);
        }
      } else {
        console.log('  (No options found)');
      }
      console.log('---');
    }
  });
}

// Run when the page is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', extractFormData);
} else {
  extractFormData();
}