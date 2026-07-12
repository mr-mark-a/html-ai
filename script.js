// script.js – Chat UI logic and GBT API integration
import { GBT_API_KEY, GBT_API_URL } from "./config.js";

const messagesDiv = document.getElementById("messages");
const form = document.getElementById("chat-form");
const textarea = document.getElementById("user-input");

let messageHistory = [];

function addMessage(content, role) {
  const msgEl = document.createElement("div");
  msgEl.classList.add("message", role);
  msgEl.textContent = content;
  messagesDiv.appendChild(msgEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addTypingIndicator() {
  const typingEl = document.createElement("div");
  typingEl.classList.add("message", "bot", "typing");
  typingEl.innerHTML = "<span></span><span></span><span></span>";
  typingEl.id = "typing-indicator";
  messagesDiv.appendChild(typingEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById("typing-indicator");
  if (el) el.remove();
}

async function sendToGBT(userInput) {
  addTypingIndicator();
  const payload = {
    model: "GBT-0.5",
    messages: [
      ...messageHistory,
      { role: "user", content: userInput }
    ]
  };
  try {
    const response = await fetch(GBT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GBT_API_KEY}`
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    const reply = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : "[No response]";
    messageHistory.push({ role: "assistant", content: reply });
    addMessage(reply, "bot");
  } catch (err) {
    console.error(err);
    addMessage("Error communicating with GBT API", "bot");
  } finally {
    removeTypingIndicator();
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = textarea.value.trim();
  if (!userText) return;
  textarea.value = "";
  addMessage(userText, "user");
  messageHistory.push({ role: "user", content: userText });
  await sendToGBT(userText);
});

// Auto‑resize textarea
textarea.addEventListener("input", () => {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
});
