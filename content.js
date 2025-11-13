// content.js - Extract questions and options from Google Form

function extractFormData() {
  // Find all question containers (skip the first one which is the title)
  const questionContainers = document.querySelectorAll('.Qr7Oae[role="listitem"]');
  
  questionContainers.forEach((container, index) => {
    // Find the question title
    const questionElement = container.querySelector('span.M7eMe');
    if (questionElement) {
      const questionText = questionElement.textContent.trim();
      console.log(`Question ${index + 1}: ${questionText}`);
      
      // Find all options within this container
      const optionElements = container.querySelectorAll('span.aDTYNe.snByac.OvPDhc.OIC90c');
      if (optionElements.length > 0) {
        console.log('  Options:');
        optionElements.forEach((opt, optIndex) => {
          const optionText = opt.textContent.trim();
          console.log(`    ${optIndex + 1}. ${optionText}`);
        });
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