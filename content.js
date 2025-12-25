// content.js
if (!window.voiceContextListenerRegistered) {
    window.voiceContextListenerRegistered = true;

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'insertText') {
            const activeElement = document.activeElement;

            if (activeElement) {
                // Handle standard input/textarea
                if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                    const start = activeElement.selectionStart;
                    const end = activeElement.selectionEnd;
                    const text = activeElement.value;

                    activeElement.value = text.substring(0, start) + request.text + text.substring(end);

                    // Move cursor to end of inserted text
                    activeElement.selectionStart = activeElement.selectionEnd = start + request.text.length;

                    // Dispatch input event to trigger any framework listeners (e.g., React, Vue)
                    activeElement.dispatchEvent(new Event('input', { bubbles: true }));
                }
                // Handle contenteditable (e.g., Gmail compose, Twitter, LinkedIn)
                else if (activeElement.isContentEditable) {
                    // Determine if we can use execCommand (deprecated but widely supported for simple text)
                    // or if we need to manipulate the DOM directly.
                    // For simplicity and broad compatibility with rich editors:
                    document.execCommand('insertText', false, request.text);
                } else {
                    console.warn("No suitable active element found for text insertion.");
                    alert("Please click inside a text box before inserting.");
                }
            } else {
                alert("Please click inside a text box before inserting.");
            }
        }
    });
}
