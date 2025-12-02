import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AIAgentChat = () => {

  const { user } = useAuth();

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'user',
      text: `Hi, my name is ${user?.fullName}`,
      timestamp: new Date()
    },
    {
      id: 2,
      type: 'ai',
      text: "It sounds like you may be experiencing refractive strain or mild astigmatism. I recommend booking an appointment with Dr. Adebayo, available near Ikeja.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        text: inputValue,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          type: 'ai',
          text: "Thank you for sharing that information. Nethra Agent build is currently not available?",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen -m-6 flex items-center justify-center bg-gray-100">
      <div className="w-full h-full flex flex-col rounded-2xl shadow-2xl overflow-hidden bg-white">
        
        {/* Header */}
        <div className="px-6 py-4 border-b bg-white" style={{ borderColor: '#e5e7eb' }}>
          <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: '#111827' }}>
            <span className="text-2xl">👁️</span>
            Nethra Smart Health Assistant
          </h2>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            Your trusted guide for eye health
          </p>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-fadeIn ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
              style={{
                animation: `fadeIn 0.5s ease-in ${index * 0.1}s both`
              }}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                message.type === 'user' ? 'bg-blue-600' : 'bg-gray-200'
              }`}>
                {message.type === 'user' ? '🙂' : '👁️'}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[75%] md:max-w-[65%] px-4 py-3 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                  message.type === 'user' 
                    ? 'rounded-tr-sm' 
                    : 'rounded-tl-sm'
                }`}
                style={{
                  background: message.type === 'user' ? '#195aff' : '#f3f4f6',
                  color: message.type === 'user' ? '#ffffff' : '#111827'
                }}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t bg-white" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms or ask a question..."
              className="flex-1 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                background: '#f9fafb',
                color: '#111827',
                border: '1px solid #d1d5db'
              }}
            />
            <button
              onClick={handleSend}
              className="px-5 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center"
              style={{
                background: '#195aff',
                color: '#ffffff'
              }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: '#6b7280' }}>
            Press Enter to send • This is an AI assistant, not a doctor
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in both;
        }
      `}</style>
    </div>
  );
};

export default AIAgentChat;