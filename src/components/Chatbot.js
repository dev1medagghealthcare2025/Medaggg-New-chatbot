import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your medical assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);

    // Simple bot response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: "Thank you for your message. I'm here to help with your medical questions.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputValue('');
  };

  return (
    <div className="chatbot-container">
      {/* Chat Button */}
      <button 
        className={`chat-button ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <img 
          src="/Chatbot.jpeg" 
          alt="Chat" 
          className="chat-button-image"
        />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div>
              <h3>Medical Assistant</h3>
            </div>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="messages-container">
            {messages.map(message => (
              <div key={message.id} className={`message ${message.sender}-message`}>
                <div className="message-bubble">
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form className="chat-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="chat-input"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
