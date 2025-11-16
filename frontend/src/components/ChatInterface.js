import React, { useState, useRef, useEffect } from 'react';
import { medicalApi } from '../utils/api';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    // Check if API key is set
    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
      const errorMessage = {
        id: Date.now(),
        role: 'assistant',
        content: 'Please set your Gemini API key in the settings first.',
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await medicalApi.chat(inputMessage, messages.slice(-10));

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "What are the differences between MRI and CT scans?",
    "How do I interpret chest X-ray results?",
    "What imaging is best for brain tumors?",
    "Explain contrast agents in medical imaging"
  ];

  return (
    <div className="chat-interface">
      <div className="chat-container">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h3>👋 Welcome to MedImaging AI Assistant</h3>
              <p>Ask me about medical imaging techniques, interpretations, or healthcare topics.</p>
              
              <div className="suggested-questions">
                <h4>Suggested Questions:</h4>
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="suggestion-btn"
                    onClick={() => setInputMessage(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map(message => (
              <div key={message.id} className={`message ${message.role}`}>
                <div className="message-header">
                  <span className="message-role">
                    {message.role === 'user' ? '👤 You' : '🏥 MedAI'}
                  </span>
                  <span className="message-time">{message.timestamp}</span>
                </div>
                <div className={`message-content ${message.isError ? 'error' : ''}`}>
                  {message.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="message assistant">
              <div className="message-header">
                <span className="message-role">🏥 MedAI</span>
              </div>
              <div className="message-content loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="message-form">
          <div className="input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about medical imaging, diagnostics, or healthcare..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !inputMessage.trim()}>
              {isLoading ? '⏳' : '📤'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;