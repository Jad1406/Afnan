// PlantChatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import './PlantChatbot.css';

const PlantChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm Afnan's plant assistant. How can I help you with your plants today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Sample responses for demonstration
  const plantResponses = {
    "care": "Most indoor plants need watering when the top inch of soil feels dry. Water thoroughly until water runs out of the drainage holes. Make sure your pot has proper drainage!",
    "light": "Many indoor plants prefer bright, indirect light. South or east-facing windows are often ideal. Plants with variegated leaves typically need more light than solid green plants.",
    "fertilizer": "Most houseplants benefit from fertilizing during the growing season (spring and summer). Use a balanced, water-soluble fertilizer at half the recommended strength.",
    "pets": "Some plants are toxic to pets! Pet-friendly options include Spider Plant, Boston Fern, Areca Palm, and Calathea. Avoid Pothos, Peace Lily, and Snake Plant if you have curious pets.",
    "beginner": "Great beginner-friendly plants include Snake Plant, ZZ Plant, Pothos, and Spider Plants. These are forgiving and can tolerate a variety of conditions.",
    "shipping": "We ship plants throughout the country! Orders over $50 qualify for free shipping. Plants are carefully packaged to ensure they arrive in perfect condition.",
    "repot": "Most houseplants need repotting every 1-2 years. Signs it's time to repot include roots growing out of drainage holes, soil drying out quickly, or slowed growth.",
    "default": "I don't have specific information about that yet, but our plant experts can help! Visit our Education section for detailed plant care guides and tips."
  };

  const getResponse = (message) => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes("care") || lowerMsg.includes("water") || lowerMsg.includes("watering")) {
      return plantResponses.care;
    } else if (lowerMsg.includes("light") || lowerMsg.includes("sun") || lowerMsg.includes("window")) {
      return plantResponses.light;
    } else if (lowerMsg.includes("fertilizer") || lowerMsg.includes("feed") || lowerMsg.includes("nutrients")) {
      return plantResponses.fertilizer;
    } else if (lowerMsg.includes("pet") || lowerMsg.includes("cat") || lowerMsg.includes("dog") || lowerMsg.includes("toxic")) {
      return plantResponses.pets;
    } else if (lowerMsg.includes("beginner") || lowerMsg.includes("new") || lowerMsg.includes("start") || lowerMsg.includes("easy")) {
      return plantResponses.beginner;
    } else if (lowerMsg.includes("shipping") || lowerMsg.includes("delivery") || lowerMsg.includes("order")) {
      return plantResponses.shipping;
    } else if (lowerMsg.includes("repot") || lowerMsg.includes("pot") || lowerMsg.includes("container")) {
      return plantResponses.repot;
    } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey")) {
      return "Hello there! How can I help with your plant needs today?";
    } else {
      return plantResponses.default;
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    
    if (inputValue.trim() === '') return;
    
    // Add user message to chat
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot thinking and typing
    setTimeout(() => {
      const botResponse = { text: getResponse(userMessage.text), sender: 'bot' };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Quick reply options
  const quickReplies = [
    "Plant care tips",
    "Best plants for beginners",
    "Pet-friendly plants",
    "Shipping information"
  ];

  const handleQuickReply = (reply) => {
    setInputValue(reply);
    const fakeEvent = { preventDefault: () => {} };
    sendMessage(fakeEvent);
  };

  return (
    <div className="plant-chatbot">
      {!isOpen ? (
        <button className="chat-toggle" onClick={toggleChat}>
          <span className="chat-icon">🌿</span>
          <span>Ask Plant Expert</span>
        </button>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <h3>🌿 Plant Care Assistant</h3>
            <button className="close-btn" onClick={toggleChat}>×</button>
          </div>
          
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {messages.length === 1 && (
            <div className="quick-replies">
              {quickReplies.map((reply, index) => (
                <button 
                  key={index} 
                  className="quick-reply-btn"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}
          
          <form className="chat-input" onSubmit={sendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Ask about plant care..."
            />
            <button type="submit">
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PlantChatbot;