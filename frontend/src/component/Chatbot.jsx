import React, { useState, useRef, useEffect } from "react";
import "../App.css";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const sessionIdRef = useRef(`session-${Math.floor(Math.random() * 100000)}`);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5500/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId: sessionIdRef.current }),
      });
      const data = await res.json();
      setMessages([...newMessages, { sender: "bot", text: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { sender: "bot", text: "⚠️ Sorry, I couldn’t connect to the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chatbot-bg">
      <div className="chatbot-card">
        <h2 className="chatbot-title">🤖 AI Chat Assistant</h2>
        <p className="chatbot-subtitle">
          Ask about autism detection, early signs, or AI analysis support.
        </p>

        <div className="chat-window">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message-bubble ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="bot-msg">Typing...</div>}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-section">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="chat-input"
          />
          <button onClick={sendMessage} disabled={loading} className="chat-send-btn">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
