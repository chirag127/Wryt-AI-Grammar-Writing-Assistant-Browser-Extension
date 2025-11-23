# Wryt - AI Writing & Grammar Checker

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green.svg)](https://github.com/chirag127/Wryt-AI-Writing-and-Grammar-Checker-Browser-Extension)

## ✨ Description

**Wryt** is a powerful, free alternative to Grammarly that leverages multiple AI providers to deliver exceptional grammar and spell checking directly in your browser. Unlike traditional grammar checkers, Wryt specializes in correcting **speech-to-text errors**, making it perfect for users who dictate their content.

Our intelligent **waterfall failover system** ensures you always get the best results by automatically switching between providers like Google Gemini, Groq, OpenRouter, Cerebras, and SambaNova. If one provider fails or is unavailable, Wryt seamlessly moves to the next configured provider.

### Key Highlights

- 🤖 **Multi-Provider AI Support** - Uses 6 different AI providers for maximum reliability
- 🔄 **Intelligent Waterfall Failover** - Automatic provider switching ensures uninterrupted service
- 🎤 **Speech-to-Text Expert** - Specialized in correcting phonetic errors, homophones, and dictation artifacts
- 📊 **4-Tier Analysis System** - Critical Grammar, Clarity, Engagement, and Delivery & Tone
- 🎨 **Brand Voice Enforcement** - Define your unique writing style and maintain consistency
- ✨ **Originality Checks** - Flag clichés, AI-sounding phrases, and generic phrasing
- 🆓 **Completely Free** - No subscriptions, no paywalls, open source forever

---

## 🚀 Live Demo

Visit our landing page: **[https://chirag127.github.io/Wryt-AI-Writing-and-Grammar-Checker-Browser-Extension](https://chirag127.github.io/Wryt-AI-Writing-and-Grammar-Checker-Browser-Extension)**

---

## 🛠️ Tech Stack / Tools Used

- **JavaScript (ES6+)** - Core extension logic
- **Chrome Extension Manifest V3** - Modern extension architecture
- **Google Gemini API** - Advanced AI language model
- **Groq API** - Fast inference with Llama models
- **OpenRouter API** - Access to multiple AI models
- **Cerebras API** - High-performance AI inference
- **SambaNova API** - Additional AI provider option
- **Chrome Storage API** - Persistent user preferences
- **Content Scripts** - DOM manipulation and UI injection
- **Context Menus API** - Right-click integration

---

## 📦 Installation Instructions

### Method 1: Manual Installation (Recommended for Development)

1. **Clone the repository:**

    ```bash
    git clone https://github.com/chirag127/Wryt-AI-Writing-and-Grammar-Checker-Browser-Extension.git
    cd Wryt-AI-Writing-and-Grammar-Checker-Browser-Extension
    ```

2. **Open Chrome (or Chromium-based browser):**
    - Navigate to `chrome://extensions/`

3. **Enable Developer Mode:**
    - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension:**
    - Click "Load unpacked"
    - Select the `extension` folder from the cloned repository

5. **Configure API Keys:**
    - Click the Wryt extension icon in your browser toolbar
    - Add API keys for at least one AI provider (Gemini, Groq, or OpenRouter recommended)
    - Get free API keys from:
        - [Google AI Studio (Gemini)](https://aistudio.google.com/apikey)
        - [Groq Console](https://console.groq.com/keys)
        - [OpenRouter](https://openrouter.ai/keys)

---

## 🔧 Usage

### Basic Grammar Checking

1. **Select Text:** Highlight any text on a webpage
2. **Right-Click:** Choose "Check Grammar & Spelling" from the context menu
3. **Review Suggestions:** View color-coded corrections:
    - 🔴 **Red** - Critical Grammar (spelling, punctuation, subject-verb agreement)
    - 🔵 **Blue** - Clarity (passive voice, wordy phrases, complex sentences)
    - 🟢 **Green** - Engagement (overused words, repetitive vocabulary)
    - 🟣 **Purple** - Delivery & Tone (politeness, formality, confidence)
4. **Apply Corrections:** Click on suggestions to apply them

### AI Text Generation

1. **Right-Click in any text field**
2. **Select "Write with AI..."**
3. **Enter your prompt** (e.g., "Write a professional email about...")
4. **Review and insert** the generated text

### Customize Settings

- Click the extension icon to access settings
- Configure:
    - **Tone:** Formal, Casual, or Neutral
    - **Dialect:** US, UK, or Canadian English
    - **Brand Voice:** Define your unique writing style
    - **Plagiarism Check:** Enable originality detection
    - **Provider Priority:** Reorder AI providers for custom waterfall logic

---

## 🧪 Features

### Core Features

✅ **Multi-Provider AI Integration**

- Google Gemini (2.0 Flash, Pro, Flash Lite)
- Groq (Llama 3.3, Mixtral, Gemma2)
- OpenRouter (Free tier models available)
- Cerebras (Llama 3.1)
- SambaNova (Llama 3.1, Qwen, DeepSeek)

✅ **Intelligent Waterfall Failover**

- Automatic provider switching on failure
- Configurable priority order
- No service interruptions

✅ **Speech-to-Text Correction Specialist**

- Phonetic error detection (e.g., "salary" → "still")
- Homophone correction (their/there/they're, write/right)
- Self-correction cleanup (e.g., "I want no I need" → "I need")
- Repetition removal (e.g., "the the" → "the")
- Filler word detection (um, uh, like)

✅ **4-Tier Analysis System**

1. **Critical Grammar** - Spelling, punctuation, articles, verb agreement
2. **Clarity** - Passive voice transformation, conciseness, simplification
3. **Engagement** - Vocabulary enhancement, cliché detection
4. **Delivery & Tone** - Politeness, formality, confidence adjustments

✅ **Premium Features (No Cost)**

- Full sentence rewrites for improved flow
- Tone shift suggestions
- Brand voice enforcement
- Originality checks (clichés, AI-sounding phrases)
- Readability scoring
- Context-aware corrections

### Technical Features

- **Context Menu Integration** - Right-click access
- **Offline Configuration** - No account required
- **Privacy-First** - No data collection, local storage only
- **Manifest V3** - Modern, secure extension architecture
- **JSON Schema Validation** - Structured AI responses
- **Error Handling** - Graceful degradation on API failures

---

## 📸 Screenshots

_Screenshots will be added soon showing the extension in action!_

---

## 🙌 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit your changes:** `git commit -m 'Add amazing feature'`
4. **Push to the branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style (Prettier configuration included)
- Test with multiple AI providers before submitting
- Update documentation for new features
- Ensure compatibility with Chrome Manifest V3

---

## 🪪 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Live Demo:** [https://chirag127.github.io/Wryt-AI-Writing-and-Grammar-Checker-Browser-Extension](https://chirag127.github.io/Wryt-AI-Writing-and-Grammar-Checker-Browser-Extension)
- **GitHub Repository:** [https://github.com/chirag127/Wryt-AI-Writing-and-Grammar-Checker-Browser-Extension](https://github.com/chirag127/Wryt-AI-Writing-and-Grammar-Checker-Browser-Extension)
- **Privacy Policy:** [Privacy Policy](https://chirag127.github.io/Wryt-AI-Writing-and-Grammar-Checker-Browser-Extension/privacy-policy.html)
- **Report Issues:** [GitHub Issues](https://github.com/chirag127/Wryt-AI-Writing-and-Grammar-Checker-Browser-Extension/issues)

---

## 🙏 Acknowledgments

- Built with ❤️ by [Chirag Singhal](https://github.com/chirag127)
- Powered by Google Gemini, Groq, OpenRouter, Cerebras, and SambaNova AI
- Inspired by the need for a free, open-source Grammarly alternative

---

## 📝 Changelog

### Version 1.1.0 (Current)

- ✨ Multi-provider AI waterfall failover
- 🎤 Speech-to-text correction specialization
- 📊 4-tier analysis system
- 🎨 Brand voice enforcement
- ✨ Originality checks

### Version 1.0.0

- 🎉 Initial release
- Basic grammar checking
- Single AI provider support

---

**Made with 💙 for writers, by writers. Free forever. Open source always.**
