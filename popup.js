import { detectContext, generateText, debugModelList } from './gemini-context.js';

// Elements are defined below

// Elements
const recordBtn = document.getElementById('record-btn');
const transcriptArea = document.getElementById('transcript');
const generatedTextArea = document.getElementById('generated-text');
const contextBadge = document.getElementById('context-badge');
const insertBtn = document.getElementById('insert-btn');
const copyBtn = document.getElementById('copy-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const apiKeyInput = document.getElementById('api-key');
const saveKeyBtn = document.getElementById('save-key');
const loadingIndicator = document.getElementById('loading-indicator');

let recognition;
let isRecording = false;
let currentContext = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Load API Key
    const result = await chrome.storage.local.get(['geminiApiKey']);
    if (result.geminiApiKey) {
        apiKeyInput.value = result.geminiApiKey;
    } else {
        settingsPanel.classList.remove('hidden');
    }

    // Detect Context
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
        currentContext = detectContext(tab.url);
        contextBadge.textContent = currentContext.id;
    } else {
        contextBadge.textContent = 'UNKNOWN';
    }

    // Setup Speech Recognition
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        // Enable continuous to prevent stopping on short pauses
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            isRecording = true;
            recordBtn.innerHTML = '<span class="icon">⏹</span> Stop Recording';
            recordBtn.classList.add('recording');
            transcriptArea.value = '';
            transcriptArea.placeholder = 'Listening...';
        };

        recognition.onend = async () => {
            // Only actual stop if user clicked stop
            if (isRecording) {
                // If it stopped but we think we are recording, it might be silence or error. 
                // But for simplicity in this MVP, we will accept it as "done" if it was silence.
                // Ideally we'd restart it here if we wanted true "always on".
                // For now, let's treat silence-stop as "user finished".
                stopRecordingFlow();
            } else {
                stopRecordingFlow();
            }
        };

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript + ' ';
                } else {
                    interim += event.results[i][0].transcript;
                }
            }

            // Very simple append logic for this demo (resets on new record)
            if (final) {
                transcriptArea.value += final;
            }
            // Optional: show interim processing? 
            // transcriptArea.placeholder = interim; 
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            if (event.error === 'no-speech') {
                return; // Ignore no-speech errors usually
            }
            isRecording = false;
            stopRecordingFlow();
            transcriptArea.placeholder = `Error: ${event.error}`;
        };
    } else {
        recordBtn.disabled = true;
        recordBtn.textContent = "Not Supported";
        transcriptArea.value = "Web Speech API not supported in this browser.";
    }
});

function stopRecordingFlow() {
    isRecording = false;
    recordBtn.innerHTML = '<span class="icon">mic</span> Record';
    recordBtn.classList.remove('recording');
    recognition.stop();

    if (transcriptArea.value.trim().length > 0) {
        handleGeneration();
    }
}

// Event Listeners
recordBtn.addEventListener('click', () => {
    if (isRecording) {
        isRecording = false; // Manually flag
        recognition.stop();
    } else {
        recognition.start();
    }
});

settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
});

saveKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
        chrome.storage.local.set({ geminiApiKey: key }, () => {
            settingsPanel.classList.add('hidden');
            alert('API Key saved!');
        });
    }
});

async function handleGeneration() {
    const transcript = transcriptArea.value;
    if (!transcript) return;

    loadingIndicator.classList.remove('hidden');
    generatedTextArea.value = '';
    insertBtn.disabled = true;
    copyBtn.disabled = true;

    try {
        const { geminiApiKey } = await chrome.storage.local.get(['geminiApiKey']);
        // Use the new robust generateText
        const text = await generateText(transcript, currentContext, geminiApiKey);
        generatedTextArea.value = text;
        insertBtn.disabled = false;
        copyBtn.disabled = false;
    } catch (error) {
        console.error(error);
        generatedTextArea.value = `Error: ${error.message}\n\n--- DIAGNOSTIC INFO ---\nChecking available models for your key...\n`;

        // Run diagnostic
        try {
            const { geminiApiKey } = await chrome.storage.local.get(['geminiApiKey']);
            const models = await debugModelList(geminiApiKey);
            generatedTextArea.value += `\nAVAILABLE MODELS:\n${models}\n\n Please paste this list in the chat so we can fix it.`;
        } catch (diagError) {
            generatedTextArea.value += `Could not list models: ${diagError.message}`;
        }
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

insertBtn.addEventListener('click', async () => {
    const text = generatedTextArea.value;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    }, () => {
        chrome.tabs.sendMessage(tab.id, { action: 'insertText', text: text });
    });
});

copyBtn.addEventListener('click', () => {
    generatedTextArea.select();
    document.execCommand('copy');
    copyBtn.textContent = 'Copied!';
    setTimeout(() => copyBtn.textContent = 'Copy', 2000);
});
