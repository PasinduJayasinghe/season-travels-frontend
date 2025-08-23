// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Trash2 } from 'lucide-react';

const Chatbot = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      text: "Hello! I'm your Season Travels assistant. I can help you with flight bookings, our services, and general travel information. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // AI Response System
  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Flight booking related responses with navigation
    if (message.includes('book') && (message.includes('flight') || message.includes('ticket'))) {
      // Navigate to book flight if navigation function is provided
      if (onNavigate) {
        setTimeout(() => {
          onNavigate('book-flight');
        }, 2000);
      }
      return "I can help you book flights! I'm taking you to the 'Book Flight' section now. There you can search for flights by entering your departure and destination cities, travel dates, and number of passengers. Would you like me to guide you through the process?";
    }
    
    if (message.includes('search') && message.includes('flight')) {
      if (onNavigate) {
        setTimeout(() => {
          onNavigate('book-flight');
        }, 2000);
      }
      return "To search for flights, I'll take you to the 'Book Flight' section. Fill in: 1) Departure city, 2) Destination city, 3) Departure date, 4) Return date (if round trip), 5) Number of passengers. Our system will show you available flights with prices and schedules.";
    }
    
    if (message.includes('price') || message.includes('cost') || message.includes('fare')) {
      return "Flight prices vary based on destination, travel dates, booking time, and availability. Our system shows real-time prices including taxes and fees. You can compare different options and choose the best fare for your needs.";
    }
    
    if (message.includes('cancel') || message.includes('refund')) {
      return "For flight cancellations and refunds, please check your booking confirmation email for specific terms. Generally, refundability depends on the fare type you purchased. Contact our support team for assistance with cancellations.";
    }
    
    // Season Travels services
    if (message.includes('season travels') || message.includes('company') || message.includes('about')) {
      return "Season Travels is your trusted travel partner specializing in flight bookings and travel services. We offer competitive prices, 24/7 customer support, and a user-friendly booking platform. We're committed to making your travel experience smooth and enjoyable.";
    }
    
    if (message.includes('service') || message.includes('offer')) {
      return "We offer comprehensive travel services including: ✈️ Flight bookings (domestic & international), 🎫 Competitive pricing, 📞 24/7 customer support, 💳 Secure payment processing, 📧 Instant booking confirmations, and 🔄 Easy booking management.";
    }
    
    if (message.includes('support') || message.includes('help') || message.includes('contact')) {
      return "Our customer support team is available 24/7 to assist you. You can reach us through this chat, email, or phone. We're here to help with bookings, changes, cancellations, and any travel-related questions.";
    }
    
    // General air travel knowledge
    if (message.includes('baggage') || message.includes('luggage')) {
      return "Baggage allowances vary by airline and ticket type. Generally: ✈️ Carry-on: 7-10kg, 1 piece, ✈️ Checked: 20-30kg for economy, ✈️ Prohibited items: liquids over 100ml, sharp objects, ✈️ Tips: Check airline-specific rules, arrive early for check-in.";
    }
    
    if (message.includes('check-in') || message.includes('checkin')) {
      return "Check-in options: 🌐 Online check-in (24-48 hours before), 📱 Mobile check-in via airline apps, 🏢 Airport kiosks, 👥 Counter check-in. Online check-in saves time and lets you choose seats. Print boarding passes or use mobile passes.";
    }
    
    if (message.includes('airport') || message.includes('security')) {
      return "Airport tips: 🕐 Arrive 2-3 hours early for international flights, 📋 Have documents ready (passport, boarding pass), 🔍 Security: remove electronics, liquids in 100ml containers, 👟 Wear easy-to-remove shoes, 📱 Download airline apps for updates.";
    }
    
    if (message.includes('passport') || message.includes('visa') || message.includes('document')) {
      return "Travel documents needed: 📘 Valid passport (6+ months validity), 📋 Visa (if required for destination), 🎫 Return/onward tickets, 💰 Proof of funds, 🏥 Travel insurance (recommended), 💉 Vaccination certificates (if required). Check embassy websites for specific requirements.";
    }
    
    if (message.includes('delay') || message.includes('late') || message.includes('cancel')) {
      return "Flight disruptions: ⏰ Check flight status regularly, 📱 Sign up for airline notifications, 🏨 Know your rights for compensation/accommodation, 📞 Contact airline for rebooking, 💼 Keep essentials in carry-on, 📄 Save all receipts for claims.";
    }
    
    if (message.includes('seat') || message.includes('upgrade')) {
      return "Seat selection: 🪑 Choose during booking or check-in, 💰 Premium seats may cost extra, 🚪 Aisle for easy access, leg room, 🪟 Window for views and rest, 👨‍👩‍👧‍👦 Families should book together, ⬆️ Upgrades available at check-in or gate.";
    }
    
    if (message.includes('food') || message.includes('meal')) {
      return "In-flight dining: 🍽️ Meals included on long flights, 🥜 Special dietary requests during booking, 🥤 Drinks usually complimentary, 🍎 Bring snacks for short flights, 💰 Premium meals available for purchase on some airlines.";
    }
    
    if (message.includes('time zone') || message.includes('jet lag')) {
      return "Managing jet lag: 🕐 Adjust sleep schedule before travel, 💧 Stay hydrated, avoid alcohol, ☀️ Get sunlight at destination, 😴 Consider melatonin (consult doctor), 🚶‍♂️ Light exercise upon arrival, ⏰ Gradually adjust meal times.";
    }
    
    // Booking flow guidance
    if (message.includes('how to book') || message.includes('booking process')) {
      return "Booking process: 1️⃣ Go to 'Book Flight' section, 2️⃣ Enter travel details (cities, dates, passengers), 3️⃣ Search available flights, 4️⃣ Compare prices and schedules, 5️⃣ Select your preferred flight, 6️⃣ Enter passenger details, 7️⃣ Complete payment, 8️⃣ Receive confirmation email.";
    }
    
    // Greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Welcome to Season Travels. I'm here to help you with flight bookings, travel information, and our services. What would you like to know about?";
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're welcome! I'm happy to help. Is there anything else you'd like to know about flights, travel, or our services?";
    }
    
    // Default fallback response
    return "I understand you're asking about travel-related topics. I can help you with: ✈️ Flight booking process, 🏢 Season Travels services, 🌍 General travel tips and information. Could you please rephrase your question or ask about one of these topics?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateAIResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      const welcomeMessage = {
        id: Date.now(),
        text: "Chat cleared! How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-slate-700 border border-slate-600 rounded-lg shadow-xl flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-600 bg-slate-800 rounded-t-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium">Season Travels Assistant</h3>
                <p className="text-slate-400 text-xs">Online now</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearChat}
                className="text-slate-400 hover:text-white transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-600 text-slate-100'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-600 text-slate-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-600">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about flights, travel, or our services..."
                className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
