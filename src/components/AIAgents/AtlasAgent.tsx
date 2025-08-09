import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Crown, User, Zap, Shield, Clock, DollarSign, Users, BarChart3 } from 'lucide-react';

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

interface AtlasAgentProps {
  isVisible: boolean;
  onClose: () => void;
  adminName?: string;
}

const AtlasAgent: React.FC<AtlasAgentProps> = ({ isVisible, onClose, adminName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Atlas's introduction for Super Admin
  const getIntroduction = () => {
    return {
      content: `Welcome back, ${adminName || 'Admin'}! 👑 I'm Atlas, your Super Admin Assistant at TradeSummit. I'm here to help you manage the entire platform, handle administrative tasks, monitor client accounts, generate invoices, and ensure smooth operations. I can also alert you about account statuses and help with strategic decisions. What would you like to work on today?`,
      suggestions: [
        "Check client account statuses",
        "Generate invoices",
        "Platform analytics overview",
        "Manage user accounts",
        "System health check"
      ]
    };
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
  }, [isVisible, adminName]);

  // Atlas's advanced response logic for admin tasks
  const getAtlasResponse = (userMessage: string): { 
    content: string; 
    suggestions?: string[]; 
    actionButtons?: Array<{
      label: string;
      action: string;
      variant: 'primary' | 'secondary' | 'warning';
    }>;
  } => {
    const message = userMessage.toLowerCase();

    // Account Management
    if (message.includes('account') || message.includes('client') || message.includes('customer')) {
      return {
        content: "I can help you manage client accounts! I've identified 3 accounts with upcoming renewals and 2 accounts that are overdue. Here's what I can do:",
        suggestions: [
          "Show overdue accounts",
          "Upcoming renewals this month", 
          "Account health scores",
          "Client usage analytics"
        ],
        actionButtons: [
          { label: "Generate Overdue Report", action: "generate_overdue_report", variant: "warning" },
          { label: "Send Renewal Reminders", action: "send_renewals", variant: "primary" }
        ]
      };
    }

    // Invoice Management
    if (message.includes('invoice') || message.includes('billing') || message.includes('payment')) {
      return {
        content: "I can handle all invoicing tasks! Currently, there are 12 invoices ready to be sent and 5 overdue payments requiring follow-up. I can generate invoices, send payment reminders, and track payment status.",
        suggestions: [
          "Generate monthly invoices",
          "Send overdue payment notices",
          "Payment status report",
          "Revenue analytics"
        ],
        actionButtons: [
          { label: "Generate All Invoices", action: "generate_invoices", variant: "primary" },
          { label: "Send Payment Reminders", action: "payment_reminders", variant: "warning" }
        ]
      };
    }

    // Platform Analytics
    if (message.includes('analytics') || message.includes('performance') || message.includes('metrics')) {
      return {
        content: "Here's your platform overview: 847 active users, 12,450 conversations this month (+23%), 94.2% customer satisfaction. Revenue is up 31% from last month. I can provide detailed breakdowns by client, agent performance, or system metrics.",
        suggestions: [
          "Client performance breakdown",
          "Revenue analytics",
          "System performance metrics",
          "User engagement stats"
        ],
        actionButtons: [
          { label: "Generate Executive Report", action: "exec_report", variant: "primary" },
          { label: "Export Analytics Data", action: "export_data", variant: "secondary" }
        ]
      };
    }

    // User Management
    if (message.includes('user') || message.includes('team') || message.includes('access')) {
      return {
        content: "I can manage all user accounts and permissions. Currently monitoring 847 active users across 156 client organizations. I can handle user provisioning, access control, and security audits.",
        suggestions: [
          "Recent user activity",
          "Permission audit",
          "Inactive user cleanup",
          "Security alerts"
        ],
        actionButtons: [
          { label: "User Security Audit", action: "security_audit", variant: "warning" },
          { label: "Bulk User Management", action: "bulk_users", variant: "secondary" }
        ]
      };
    }

    // System Health
    if (message.includes('system') || message.includes('health') || message.includes('status')) {
      return {
        content: "System status: All services operational ✅ 99.97% uptime this month, API response time averaging 145ms. I've detected no critical issues. Database performance is optimal, and all integrations are functioning normally.",
        suggestions: [
          "Detailed system metrics",
          "Integration status",
          "Performance optimization",
          "Backup status"
        ],
        actionButtons: [
          { label: "Full System Report", action: "system_report", variant: "primary" },
          { label: "Schedule Maintenance", action: "schedule_maintenance", variant: "secondary" }
        ]
      };
    }

    // Financial Management
    if (message.includes('revenue') || message.includes('financial') || message.includes('profit')) {
      return {
        content: "Financial overview: Monthly recurring revenue is $487,300 (+31% MoM), with 94% payment collection rate. I can generate financial reports, forecast revenue, and identify growth opportunities.",
        suggestions: [
          "Monthly financial report",
          "Revenue forecasting",
          "Client profitability analysis",
          "Churn risk assessment"
        ],
        actionButtons: [
          { label: "Generate Financial Report", action: "financial_report", variant: "primary" },
          { label: "Revenue Forecast", action: "revenue_forecast", variant: "secondary" }
        ]
      };
    }

    // Alerts and Notifications
    if (message.includes('alert') || message.includes('notification') || message.includes('urgent')) {
      return {
        content: "Current alerts: 2 high-priority items require attention - TechCorp's usage is 150% over plan limit, and HealthPlus has an overdue payment of $12,500. I can handle these automatically or escalate as needed.",
        suggestions: [
          "View all alerts",
          "Auto-resolve low priority",
          "Escalation procedures",
          "Alert configuration"
        ],
        actionButtons: [
          { label: "Handle Urgent Items", action: "handle_urgent", variant: "warning" },
          { label: "Configure Auto-Actions", action: "auto_actions", variant: "secondary" }
        ]
      };
    }

    // Default comprehensive response
    return {
      content: "I'm your comprehensive admin assistant! I can help with client management, invoicing, platform analytics, user administration, system monitoring, and financial oversight. I proactively monitor for issues and can automate routine tasks. What specific area would you like to focus on?",
      suggestions: [
        "Today's priority tasks",
        "Client account overview",
        "Financial dashboard",
        "System health check",
        "User management"
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate processing delay
    setTimeout(() => {
      const response = getAtlasResponse(inputValue);
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        actionButtons: response.actionButtons
      };

      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleActionClick = (action: string) => {
    // Simulate action execution
    const actionMessage: Message = {
      id: Date.now().toString(),
      type: 'agent',
      content: `✅ Action executed: ${action.replace('_', ' ')}. Task completed successfully. Results have been processed and relevant stakeholders have been notified.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, actionMessage]);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-300 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-t-2xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold">Atlas</h3>
              <p className="text-sm text-slate-300">Super Admin Assistant</p>
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
          <span className="text-sm text-slate-300">Admin Mode Active</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${
              message.type === 'user' 
                ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white' 
                : 'bg-slate-50 text-slate-900 border border-slate-200'
            } rounded-2xl p-3`}>
              <div className="flex items-start space-x-2">
                {message.type === 'agent' && (
                  <Crown className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.actionButtons && (
                    <div className="mt-3 space-y-2">
                      {message.actionButtons.map((button, index) => (
                        <button
                          key={index}
                          onClick={() => handleActionClick(button.action)}
                          className={`block w-full text-left text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
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
                          className="block w-full text-left text-xs bg-white/50 hover:bg-white/70 px-3 py-2 rounded-lg transition-colors border border-slate-200"
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
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-orange-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me about admin tasks, analytics, billing..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-slate-600 to-slate-700 text-white p-2 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-center mt-2 text-xs text-slate-500">
          <Shield className="w-3 h-3 mr-1" />
          <span>Super Admin Access • Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default AtlasAgent;