import { useState } from "react";
import api from "../api";
import "./Chatbot.css";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "model", text: "Hello! I am your AI Health Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/api/ai/chat", {
        message: userText
      });

      setMessages(prev => [
        ...prev,
        { role: "model", text: response.data.response }
      ]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages(prev => [
        ...prev,
        { role: "model", text: "I'm having trouble connecting right now. Please try again later." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="chatbot-container">
        {isOpen && (
            <div className="chat-window">
              <div className="chat-header">
                <h3>MediBot AI</h3>
                {/* Removed duplicate cross button from here */}
              </div>

              <div className="chat-body">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.role}`}>
                      <p>{msg.text}</p>
                    </div>
                ))}
                {loading && (
                    <div className="chat-message model">
                      <p>Thinking...</p>
                    </div>
                )}
              </div>

              <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask a health question..."
                />
                <button onClick={handleSend}>➤</button>
              </div>
            </div>
        )}

        <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "💬"}
        </button>
      </div>
  );
}
