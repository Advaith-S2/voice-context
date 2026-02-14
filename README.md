# 🎙️ VoiceContext
> **Context-Aware Voice Typing for the Web, powered by Gemini 2.0**

VoiceContext changes how you interact with the web. Instead of just "speech-to-text", it uses AI to understand **where you are** and **what you need**, transforming your spoken thoughts into perfectly formatted content instantly.

## 🚀 Key Features

*   **🧠 Context Intelligence**: Automatically detects if you are on **Gmail**, **Twitter/X**, or **LinkedIn** and adapts the writing style.
    *   *Gmail* -> Professional, polite emails.
    *   *Twitter* -> Insightful, viral micro-blogs (under 280 chars).
    *   *LinkedIn* -> Engaging career updates.
*   **⚡ Powered by Gemini 2.0**: Uses Google's latest `gemini-2.0-flash` model for lightning-fast reasoning and natural language generation.
*   **🎯 One-Click Insertion**: Generates the text and inserts it directly into the active text box (no copy-pasting required).
*   **🗣️ Continuous Listening**: Intelligent voice recognition that doesn't cut you off when you pause to think.

Here is the rest of the content to complete your `README.md`. It covers the setup, usage, and technical details to make the repo look professional and usable for others.

---

## 🛠️ Getting Started

### Prerequisites

* A Chromium-based browser (Chrome, Brave, Edge).
* A Gemini API Key from [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the Repo:**
```bash
git clone https://github.com/Advaith-S2/voice-context.git

```
2. **Open Extensions Page:** Go to `chrome://extensions/` in your browser.
3. **Enable Developer Mode:** Toggle the switch in the top-right corner.
4. **Load Unpacked:** Click "Load unpacked" and select the `voice-context` folder.
5. **Configure API Key:** Click the extension icon in your toolbar and enter your Gemini API key.

## 🏗️ Technical Architecture

* **Frontend:** HTML/CSS/JavaScript (Chrome Extension V3).
* **Speech Processing:** Web Speech API for real-time transcription.
* **AI Engine:** `gemini-2.0-flash` for contextual rewriting and formatting.
* **Context Awareness:** `content.js` monitors active tab URLs and DOM elements to provide site-specific prompts to the LLM.

---

## 📂 File Structure

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension metadata and permissions. |
| `gemini-context.js` | Main logic for API communication and prompt engineering. |
| `content.js` | Injects functionality into the webpage and handles text insertion. |
| `popup.html/js` | The UI for controlling recording and settings. |

---

