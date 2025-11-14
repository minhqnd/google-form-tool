# Google Forms AI Assistant

An intelligent Chrome extension that automatically fills Google Forms using Google's Gemini AI. Supports multiple choice, checkboxes, short answers, and long answers.

## Features

- 🤖 AI-powered form filling using Gemini API
- 📝 Supports all question types: multiple choice, checkboxes, short/long text
- 🎯 Click on question titles for individual filling
- 🚀 "Solve All" button for batch processing
- 🔑 Secure API key storage in browser
- 🎨 Modern, user-friendly popup interface

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked" and select the extension folder
5. The extension will be installed and ready to use

## Setup

### Get Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Copy the API key

### Configure Extension
1. Click the extension icon in Chrome toolbar
2. Paste your Gemini API key in the input field
3. Click "Save API Key"

## Usage

### Fill Individual Questions
1. Open a Google Form
2. Click on any question title
3. The extension will analyze and fill the answer automatically

### Fill All Questions at Once
1. Open a Google Form
2. Click the extension icon
3. Click "Solve All Questions"
4. All questions will be processed sequentially

## Supported Question Types

- ✅ Multiple Choice (Radio buttons)
- ☑️ Checkboxes (Multiple selections)
- 📝 Short Answer (Text input)
- 📄 Long Answer (Textarea)

## Privacy & Security

- API keys are stored locally in your browser's storage
- No data is sent to external servers except Gemini API
- All processing happens client-side

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created by [minhqnd](https://github.com/minhqnd)

## Disclaimer

This extension is for educational and productivity purposes. Please use responsibly and in accordance with Google Forms terms of service.