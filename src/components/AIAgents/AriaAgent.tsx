import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { MessageSquare, X, Send, Bot, User, Sparkles, Shield, Clock, Loader2, Zap } from 'lucide-react';
import { generateAriaResponse, GeminiResponse } from '../../lib/gemini';

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actionButtons?: Array<{
    label: string;
    action: string;
    variant: 'primary' | 'secondary' | 'warning';
  }>;
}

interface AriaAgentProps {
  isVisible: boolean;
  onClose: () => void;
  userType: 'customer' | 'prospect';
  userName?: string;
}

const AriaAgent: React.FC<AriaAgentProps> = ({ isVisible, onClose, userType, userName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  // Create a ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Aria's introduction based on user type
  const getIntroduction = () => {
    if (userType === 'customer') {
      return {
        content: `Hello ${userName || 'there'}! 👋 I'm Aria, your dedicated Customer Success Agent at TradeSummit. I'm powered by Google Gemini AI and I'm here to help you optimize your AI agents, answer questions about your account, and ensure you're getting maximum value from our platform. How can I help you today?`,
        suggestions: [
          "Check my AI agent performance",
          "Help with billing questions", 
          "Technical support needed",
          "Want to create new agents",
          "Integration assistance"
        ]
      };
    } else {
      return {
        content: `Welcome to TradeSummit! 🌟 I'm Aria, your AI Customer Success Agent powered by Google Gemini. I'm genuinely excited to help you discover how our AI agents can transform your business! Whether you're curious about pricing, want to see a demo, or have specific questions about our platform, I'm here to help. What would you like to explore first?`,
        suggestions: [
          "Tell me about TradeSummit",
          "Show me pricing options",
          "I want to see a demo",
          "Industry-specific solutions",
          "Security and compliance"
        ]
      };
    }
  };

  // Initialize conversation
  useEffect(() => {
    if (isVisible && messages.length === 0) {
      const intro = getIntroduction();
      setMessages([{
        id: '1',
        type: 'agent',
        content: intro.content,
        timestamp: new Date(),
        suggestions: intro.suggestions
      }]);
    }
  }, [isVisible, userType, userName]);

  // Effect for auto-scrolling to the bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]); // Scroll whenever messages or typing status changes

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Update conversation history for context
    const newHistory = [...conversationHistory, { role: 'user' as const, content: inputValue }];
    setConversationHistory(newHistory);
    
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Get AI response from Gemini
      console.log('Sending to Gemini:', currentInput);
      const response: GeminiResponse = await generateAriaResponse(currentInput, userType, newHistory);
      console.log('Gemini response:', response);
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        actionButtons: response.actionButtons
      };

      setMessages(prev => [...prev, agentMessage]);
      
      // Update conversation history
      setConversationHistory(prev => [...prev, { role: 'assistant', content: response.content }]);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback error message with personality
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: "Oops! I'm having a small technical hiccup right now. 😅 But don't worry - I'm still here to help! You can also reach our team directly at support@tradesummit.ai or I can connect you with a human agent. What would you prefer?",
        timestamp: new Date(),
        suggestions: ["Try asking again", "Contact human support", "Email support team", "Technical help"]
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleActionClick = (action: string) => {
    // Handle action button clicks with feedback
    const actionMessage: Message = {
      id: Date.now().toString(),
      type: 'agent',
      content: `✅ Great choice! I'm taking care of "${action.replace(/_/g, ' ')}" for you right now. Let me get that set up...`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, actionMessage]);
    
    // Handle specific actions
    setTimeout(() => {
      switch (action) {
        case 'schedule_demo':
          window.open('https://calendly.com/tradesummit-demo', '_blank');
          break;
        case 'view_pricing':
          document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'view_integrations':
          document.getElementById('integrations')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'industry_solutions':
          document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'get_started':
          const followUpMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: 'agent',
            content: "Perfect! Let's get you started. I'd recommend beginning with a quick demo to see our AI agents in action. Would you like me to schedule that for you, or do you have specific questions about how TradeSummit works?",
            timestamp: new Date(),
            suggestions: ["Schedule demo now", "Ask about pricing", "See industry solutions", "Technical questions"],
            actionButtons: [
              { label: "Book Demo", action: "schedule_demo", variant: "primary" }
            ]
          };
          setMessages(prev => [...prev, followUpMessage]);
          break;
        default:
          console.log('Action:', action);
      }
    }, 1000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-orange-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-blue-600 p-4 rounded-t-2xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">Aria</h3>
              <p className="text-sm text-orange-100">AI Customer Success Agent</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <Zap className="w-3 h-3 text-yellow-300" />
          <span className="text-sm text-orange-100">Powered by Google Gemini AI</span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesEndRef}> {/* Added ref here */}
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${
              message.type === 'user' 
                ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white' 
                : 'bg-orange-50 text-slate-900 border border-orange-200'
            } rounded-2xl p-3`}>
              <div className="flex items-start space-x-2">
                {message.type === 'agent' && (
                  <Bot className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.actionButtons && (
                    <div className="mt-3 space-y-2">
                      {message.actionButtons.map((button, index) => (
                        <button
                          key={index}
                          onClick={() => handleActionClick(button.action)}
                          className={`block w-full text-left text-xs px-3 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                            button.variant === 'primary' 
                              ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white hover:shadow-lg'
                              : button.variant === 'warning'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {button.label}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-xs bg-white/50 hover:bg-white/70 px-3 py-2 rounded-lg transition-all border border-orange-200 hover:border-orange-300 hover:scale-105 transform"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-orange-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-xs text-orange-600">Aria is thinking...</span>
              </div>
            </div>
          </div>
        )}
        {/* This empty div ensures the scroll always goes to the very bottom */}
        <div ref={messagesEndRef} /> 
      </div>

      {/* Input */}
      <div className="p-4 border-t border-orange-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
            placeholder="Ask me anything about TradeSummit..."
            className="flex-1 px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-to-r from-orange-500 to-blue-600 text-white p-2 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105"
          >
            {isTyping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-center mt-2 text-xs text-slate-500">
          <Shield className="w-3 h-3 mr-1" />
          <span>Powered by Google Gemini AI • Secure & HIPAA Compliant</span>
        </div>
      </div>
    </div>
  );
};

export default AriaAgent;
