const aiImgURL = chrome.runtime.getURL("icons/icon16.png");
const askAiButton = document.createElement("button");

const observer = new MutationObserver(() => {
    addAskAiButton();
});

observer.observe(document.body, { childList: true, subtree: true });

addAskAiButton();

function onProblemsPage() {
    return window.location.pathname.startsWith('/problems/');
}

function getProblemContext() {
    const problemDescription = document.getElementsByClassName('coding_desc_container__gdB9M')[0].innerText;
    return `Problem Description: ${problemDescription}`;
}

function addAskAiButton() {
    if (!onProblemsPage() || document.getElementById("add-ai-button")) return;
    askAiButton.id = "add-ai-button";
    askAiButton.innerText = "AI Help";
    askAiButton.classList.add("ai-help-button");

    const askDoubtButton = document.getElementsByClassName("coding_ask_doubt_button__FjwXJ")[0];

    if (askDoubtButton) {
        askDoubtButton.insertAdjacentElement("afterend", askAiButton);
        askAiButton.addEventListener("click", function() {
            openChatWindow();
        });
    } else {
        console.log("Ask Doubt button not found!");
    }
}

const chatBox = document.createElement("div");
chatBox.id = "ai-chat-box";
chatBox.classList.add("ai-chat-box");

const closeButton = document.createElement("button");
closeButton.innerText = "Close";
closeButton.classList.add("ai-close-button");
chatBox.appendChild(closeButton);

const chatMessages = document.createElement("div");
chatMessages.id = "chat-messages";
chatMessages.classList.add("ai-chat-messages");
chatBox.appendChild(chatMessages);

const inputField = document.createElement("input");
inputField.type = "text";
inputField.placeholder = "Ask AI...";
inputField.classList.add("ai-chat-input");
chatBox.appendChild(inputField);

const sendButton = document.createElement("button");
sendButton.innerText = "Send";
sendButton.classList.add("ai-chat-send");
chatBox.appendChild(sendButton);

document.body.appendChild(chatBox);

askAiButton.addEventListener("click", () => {
  chatBox.style.display = chatBox.style.display === "none" ? "block" : "none";
});

window.addEventListener("popstate", () => {
    chatBox.style.display = "none";
});

closeButton.addEventListener("click", () => {
  chatBox.style.display = "none";
});

sendButton.addEventListener("click", async () => {
  const userMessage = inputField.value.trim();
  if (userMessage) {
    // Display user's message in chatbox
    const userMsgDiv = document.createElement("div");
    userMsgDiv.innerText = "You: " + userMessage;
    chatMessages.appendChild(userMsgDiv);

    try {
      // Detect Request Type
      if (userMessage.toLowerCase().includes("hint")) {
        conversationState.hint_requested = true;
        conversationState.code_requested = false; // Reset code state
      } else if (userMessage.toLowerCase().includes("code")) {
        conversationState.code_requested = true;
      }

      const problemContext = getProblemContext(); // Problem details
      const fullQuery = `${problemContext}\nUser Query: ${userMessage}`; // Context + Query

      const aiResponse = await getAIResponse(fullQuery);

      // Display AI's response in chatbox
      const aiMsgDiv = document.createElement("div");
      aiMsgDiv.innerText = "AI: " + aiResponse;
      chatMessages.appendChild(aiMsgDiv);
    } catch (error) {
      const aiMsgDiv = document.createElement("div");
      aiMsgDiv.innerText = "AI: Sorry, I couldn't process that.";
      chatMessages.appendChild(aiMsgDiv);
    }

    // Clear input and scroll to the latest message
    inputField.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});


let conversationHistory = [
  {
    role: "user",
    parts: [{ text: "You are an AI assistant for programming queries. Start by asking how you can help. Provide hints first and only give code when explicitly requested." }],
  },
];

let conversationState = {
  hint_requested: false,
  code_requested: false,
};

async function getAIResponse(query) {
  const API_KEY = "YOUR_API_KEY"; //Replace this with your API key.
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    // Manage State for Contextual Responses
    let prompt = query;

    if (!conversationState.hint_requested && !conversationState.code_requested) {
      prompt = `I have a programming query. ${query}. Can you provide hints first without giving the full code?`;
    } else if (conversationState.hint_requested && !conversationState.code_requested) {
      prompt = `Can you continue providing hints based on this problem? ${query}`;
    } else if (conversationState.code_requested) {
      prompt = `Please provide the complete code solution for this problem. ${query}`;
    }
    conversationHistory.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: conversationHistory, // Pass conversation history
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (data.candidates && data.candidates.length > 0) {
      const aiResponse = data.candidates[0].content.parts[0].text || "AI: No response available.";

      conversationHistory.push({
        role: "model",
        parts: [{ text: aiResponse }],
      });

      return aiResponse;
    } else {
      return "AI: No valid output.";
    }
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Error processing your request.";
  }
}

