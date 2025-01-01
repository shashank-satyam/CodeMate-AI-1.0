**AI-Powered Problem-Solving Assistant (Chrome Extension)**

**Overview**
This project is a Chrome Extension designed to assist users in solving programming problems on maang.in. It leverages Google Gemini API to provide AI-driven suggestions, hints, and code solutions based on the current problem context.

With this extension, users can:
 1. Get context-aware hints before full solutions.
 2. Engage in conversational AI support for problem-solving.
 3. Seamlessly access AI assistance directly from problem pages.

**Key Features**
1. AI Help Button: Adds a button next to the "Ask Doubt" button on problem pages to access AI assistance.
2. Context-Aware Responses: AI automatically detects the problem context (description) and provides suggestions.
3. Hint-First Approach: AI gives hints initially and only provides complete code when explicitly requested.
4. Dynamic Visibility: Chatbox appears only when requested and hides automatically when navigating away from problem pages.
5. Real-Time Conversations: Supports ongoing conversations with memory for query context.

**Tech Stack**
1. Frontend: HTML, CSS, JavaScript
2. API Integration: Google Gemini API
3. Browser Compatibility: Chrome

**Setup Instructions**

Step 1: Clone the Repository
Step 2: Add API Key.
        1. Open the content.js file.
        2. Replace the placeholder API key in this line:
           const API_KEY = "YOUR_API_KEY_HERE";

Step 3: Load the Extension in Chrome:-
        1. Open Chrome and go to chrome://extensions/.
        2. Enable Developer mode (top-right corner).
        3. Click Load unpacked and select the project folder.
        4. The extension should now appear in your browser.

**How to Use**
1. Visit a problem page on maang.in.
2. Click the AI Help button next to the Ask Doubt button.
3. A chatbox will open—type your query.
4. Get hints first, and request code explicitly if needed.

**Future Improvements**
1. Error Handling: Improve handling of API failures and network issues.
2. Multi-Language Support: Extend support to programming languages other than Java.
3. User Preferences: Allow users to configure AI behavior and response types.

**Contributing**
Contributions are welcome!

1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Commit changes (git commit -m "Add new feature").
4. Push to the branch (git push origin feature-branch).
5. Open a Pull Request.
