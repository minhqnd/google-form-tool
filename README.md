# Google Forms AI Assistant

An intelligent Chrome extension that automatically fills Google Forms using Google's Gemini AI. Supports multiple choice, checkboxes, short answers, and long answers.

## Quick Start

1. **Install**: Load the extension in Chrome (see [Installation](#installation))
2. **Configure**: Get a Gemini API key and save it in the extension
3. **Use**: Open any Google Form and click on questions or use "Solve All"

## Features

- 🤖 AI-powered form filling using Gemini API
- 📝 Supports all question types: multiple choice, checkboxes, short/long text
- 🎯 Click on question titles for individual filling
- 🚀 "Solve All" button for batch processing
- 🔑 Secure API key storage in browser
- 🎨 Modern, user-friendly popup interface

## Installation

**Requirements:**
- Google Chrome browser
- A Gemini API key (free tier available at [Google AI Studio](https://aistudio.google.com/))

This extension is not available on the Chrome Web Store. Follow these steps to install it manually:

### Step 1: Download the Extension
- **Option A**: Download the ZIP file
  1. Click the green "Code" button on this repository
  2. Select "Download ZIP"
  3. Extract the ZIP file to a folder on your computer

- **Option B**: Clone the repository
  ```bash
  git clone https://github.com/minhqnd/google-form-tool.git
  ```

### Step 2: Load the Extension in Chrome
1. Open Google Chrome
2. Navigate to `chrome://extensions/` in the address bar
3. Enable "Developer mode" using the toggle switch in the top-right corner
4. Click the "Load unpacked" button that appears
5. Browse to and select the folder containing the extension files (the folder with `manifest.json`)
6. The extension should now appear in your extensions list and be ready to use

### Troubleshooting
- If you don't see "Load unpacked", make sure "Developer mode" is enabled
- Make sure you select the folder containing `manifest.json`, not a parent folder
- If the extension doesn't work, try refreshing the extension by clicking the refresh icon on the extension card

## Setup

### Get Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" or navigate to the API keys section
4. Create a new API key (or use an existing one)
5. Copy the API key for use in the extension

**Note:** The Gemini API offers a free tier with generous limits. You don't need a paid account to use this extension.

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

## Frequently Asked Questions

### How do I get the extension?
This extension is not published on the Chrome Web Store. You need to install it manually using the "Load unpacked" method (see [Installation](#installation)).

### Is the Gemini API free?
Yes, Google offers a free tier for the Gemini API with generous usage limits. You can get started at [Google AI Studio](https://aistudio.google.com/).

### Why isn't the extension working?
Make sure you:
1. Have entered a valid Gemini API key
2. Are on a Google Forms page (`docs.google.com/forms/*`)
3. Have clicked on a question title or used the "Solve All" button
4. Have an active internet connection

### Can I contribute to this project?
Yes! Contributions are welcome. See the [Contributing](#contributing) section below.

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