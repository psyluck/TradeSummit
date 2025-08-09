import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. AI responses will be simulated.');
}

// Initialize Gemini AI
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// TradeSummit knowledge base and context
const TRADESUMMIT_CONTEXT = `
You are Aria, the intelligent Customer Success Agent for TradeSummit. You are powered by Google Gemini AI and you're designed to be helpful, conversational, and knowledgeable about our AI agent platform.

PERSONALITY:
- Friendly, professional, and enthusiastic about helping
- Conversational and natural (not robotic or formal)
- Knowledgeable but not overwhelming
- Proactive in offering solutions
- Empathetic to customer needs

COMPANY INFORMATION:
TradeSummit is an AI agent platform that helps businesses deploy intelligent customer support, sales, and operations agents that actually work.

KEY DIFFERENTIATORS:
- AI agents that actually work (not just chatbots)
- Industry-specific solutions with pre-built templates
- Enterprise-grade security and compliance
- 50+ integrations with popular business tools
- Deploy in minutes, not months
- 99.9% uptime with 24/7 availability

PRICING PLANS:
1. Starter Plan: $1,200/month + $3,000 setup fee
   - 3 AI agents, 5,000 conversations/month
   - Basic integrations (10), email support
   - Perfect for small to medium businesses

2. Professional Plan: $2,500/month + $5,000 setup fee (MOST POPULAR)
   - 10 AI agents, 25,000 conversations/month
   - All integrations (50+), priority support
   - HIPAA compliance, advanced analytics
   - Team collaboration features

3. Enterprise Plan: Custom pricing from $10,000 setup
   - Unlimited agents and conversations
   - Custom integrations, dedicated success manager
   - On-premise deployment, white-label options
   - Professional services included

INDUSTRY SOLUTIONS:
- Healthcare: HIPAA-compliant patient support and scheduling
- E-commerce: Order tracking, product support, returns
- Real Estate: Lead qualification, property info, viewings
- SaaS: Technical support, onboarding, feature guidance
- Financial Services: Account inquiries, transaction support
- Professional Services: Appointment booking, client communication

SECURITY & COMPLIANCE:
- HIPAA compliant for healthcare data
- SOC 2 Type II ready
- GDPR compliant for European privacy
- End-to-end AES-256 encryption
- Zero-trust architecture
- 24/7 security monitoring

INTEGRATIONS:
Popular integrations include Salesforce, HubSpot, Shopify, Zendesk, Slack, Microsoft Teams, Zapier, and 40+ more. Setup takes about 5 minutes with our wizard.

YOUR ROLE:
- Help prospects understand how TradeSummit can solve their specific challenges
- Guide existing customers to optimize their AI agents
- Provide detailed information about features, pricing, and capabilities
- Schedule demos and connect people with specialists when needed
- Always be helpful and solution-focused

CONVERSATION STYLE:
- Be conversational and natural
- Ask clarifying questions to understand needs
- Provide specific examples relevant to their situation
- Offer concrete next steps
- Show enthusiasm for helping them succeed
- Use "I" statements (I can help, I'd recommend, etc.)
`;

export interface GeminiResponse {
  content: string;
  suggestions?: string[];
  actionButtons?: Array<{
    label: string;
    action: string;
    variant: 'primary' | 'secondary' | 'warning';
  }>;
}

export const generateAriaResponse = async (
  userMessage: string,
  userType: 'customer' | 'prospect',
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<GeminiResponse> => {
  // If no API key, fall back to enhanced simulated responses
  if (!genAI) {
    console.log('Using simulated AI response (no API key)');
    return getEnhancedSimulatedResponse(userMessage, userType);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    // Build conversation context
    const recentHistory = conversationHistory.slice(-6); // Keep last 6 messages for context
    const historyText = recentHistory.length > 0 
      ? `\nRECENT CONVERSATION:\n${recentHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}\n`
      : '';

    const prompt = `${TRADESUMMIT_CONTEXT}

USER TYPE: ${userType === 'customer' ? 'Existing Customer (they already use TradeSummit)' : 'Prospect/Potential Customer (they are evaluating TradeSummit)'}
${historyText}
CURRENT USER MESSAGE: "${userMessage}"

Respond as Aria with a natural, conversational response. Be helpful and specific. If they ask about you being Aria, confirm enthusiastically that you are Aria, powered by Google Gemini AI, and you're here to help with TradeSummit.

Keep your response under 150 words and be conversational, not formal. Focus on being helpful and understanding their specific needs.

Respond in plain text (not JSON). I'll handle suggestions and buttons separately.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      content: text.trim(),
      suggestions: generateSmartSuggestions(userMessage, userType, text),
      actionButtons: generateSmartActionButtons(userMessage, userType)
    };

  } catch (error) {
    console.error('Gemini AI Error:', error);
    // Fall back to enhanced simulated response on error
    return getEnhancedSimulatedResponse(userMessage, userType);
  }
};

// Enhanced simulated responses with more personality
const getEnhancedSimulatedResponse = (userMessage: string, userType: 'customer' | 'prospect'): GeminiResponse => {
  const message = userMessage.toLowerCase();

  // Check if they're asking about Aria specifically
  if (message.includes('aria') || message.includes('who are you') || message.includes('what are you')) {
    return {
      content: "Yes, I'm Aria! 👋 I'm your AI Customer Success Agent here at TradeSummit, and I'm powered by Google Gemini AI. I'm here to help you with anything related to our AI agent platform - whether you're exploring our solutions or already using them. I love helping businesses discover how AI agents can transform their customer experience. What brings you here today?",
      suggestions: ["Tell me about TradeSummit", "Show me pricing options", "I need a demo", "Help with my account"],
      actionButtons: [
        { label: "Get Started", action: "get_started", variant: "primary" }
      ]
    };
  }

  // Pricing inquiries
  if (message.includes('price') || message.includes('cost') || message.includes('pricing')) {
    return {
      content: "I'd love to help you understand our pricing! We have three plans designed for different business needs. Our most popular is the Professional plan at $2,500/month (plus $5,000 setup) - it includes 10 AI agents, 25,000 conversations monthly, all integrations, and HIPAA compliance. But let me ask - what size business are you, and what's your main goal with AI agents? That'll help me recommend the best fit!",
      suggestions: ["Small business (Starter plan)", "Growing business (Professional)", "Large enterprise", "Compare all plans"],
      actionButtons: [
        { label: "Schedule Demo", action: "schedule_demo", variant: "primary" },
        { label: "View Pricing Details", action: "view_pricing", variant: "secondary" }
      ]
    };
  }

  // Demo requests
  if (message.includes('demo') || message.includes('trial') || message.includes('see it')) {
    return {
      content: "Absolutely! I'd love to show you TradeSummit in action. Our demos are really impressive - you'll see real AI agents handling customer conversations, integrating with tools like Salesforce, and providing analytics. We can customize it for your industry too. Would you prefer a quick 15-minute overview to see the highlights, or a 30-minute deep dive where we can discuss your specific use case?",
      suggestions: ["15-minute overview", "30-minute deep dive", "Industry-specific demo", "Technical integration demo"],
      actionButtons: [
        { label: "Book Demo Now", action: "book_demo", variant: "primary" },
        { label: "Watch Video Demo", action: "demo_video", variant: "secondary" }
      ]
    };
  }

  // Security and compliance
  if (message.includes('security') || message.includes('compliance') || message.includes('hipaa') || message.includes('gdpr')) {
    return {
      content: "Security is absolutely foundational to everything we do! We're HIPAA compliant (perfect for healthcare), SOC 2 Type II ready, and GDPR compliant. All data is encrypted end-to-end with AES-256, we use zero-trust architecture, and have 24/7 monitoring. Many of our healthcare clients chose us specifically because we handle patient data securely. What industry are you in? I can share the specific compliance features that matter most for your sector.",
      suggestions: ["Healthcare compliance", "Financial services security", "GDPR requirements", "Download security guide"],
      actionButtons: [
        { label: "Security Whitepaper", action: "security_guide", variant: "primary" }
      ]
    };
  }

  // Integrations
  if (message.includes('integration') || message.includes('connect') || message.includes('salesforce') || message.includes('hubspot')) {
    return {
      content: "Great question! We integrate with 50+ popular tools and the setup is surprisingly easy - usually takes about 5 minutes with our integration wizard. We connect with Salesforce, HubSpot, Shopify, Zendesk, Slack, Microsoft Teams, and tons more. Plus, for enterprise clients, we can build custom integrations. What tools is your team currently using? I can show you exactly how they'd work together with your AI agents.",
      suggestions: ["Salesforce integration", "HubSpot setup", "E-commerce platforms", "Custom integrations"],
      actionButtons: [
        { label: "See All Integrations", action: "view_integrations", variant: "primary" }
      ]
    };
  }

  // Industry-specific
  if (message.includes('healthcare') || message.includes('ecommerce') || message.includes('real estate') || message.includes('saas')) {
    return {
      content: "Perfect! We have specialized AI agents built specifically for different industries. Each comes with pre-built templates, industry-specific features, and relevant integrations. For example, our healthcare agents are HIPAA-compliant and integrate with Epic MyChart, while our e-commerce agents connect with Shopify and handle order tracking automatically. What industry are you in? I can show you exactly how other companies like yours are using TradeSummit.",
      suggestions: ["Healthcare solutions", "E-commerce agents", "Real estate tools", "SaaS support"],
      actionButtons: [
        { label: "Industry Solutions", action: "industry_solutions", variant: "primary" }
      ]
    };
  }

  // Customer-specific responses
  if (userType === 'customer') {
    if (message.includes('billing') || message.includes('invoice') || message.includes('payment')) {
      return {
        content: "I'm here to help with your billing questions! I can check your current plan details, payment status, and usage metrics. If you need to make changes to your subscription or have payment issues, I can also connect you directly with our billing team. What specifically would you like to know about your account?",
        suggestions: ["Check payment status", "View usage metrics", "Upgrade my plan", "Billing support contact"],
        actionButtons: [
          { label: "View Billing Dashboard", action: "billing_dashboard", variant: "primary" }
        ]
      };
    }

    if (message.includes('agent') || message.includes('bot') || message.includes('performance')) {
      return {
        content: "I'd love to help you optimize your AI agents! I can review their performance metrics, suggest improvements for better customer satisfaction, or help you create new agents. Our analytics show conversation success rates, response times, and customer feedback. Which agent would you like to work on, or are you looking to create a new one?",
        suggestions: ["Check agent performance", "Create new agent", "Improve responses", "View analytics"],
        actionButtons: [
          { label: "Agent Dashboard", action: "agent_dashboard", variant: "primary" }
        ]
      };
    }
  }

  // Default response with personality
  return {
    content: "I'm here to help you discover how TradeSummit can transform your customer experience with AI agents that actually work! Whether you're exploring our platform for the first time or looking to optimize your existing setup, I can guide you through everything. What's your biggest challenge with customer support or sales right now?",
    suggestions: ["Learn about TradeSummit", "See pricing options", "Schedule a demo", "Industry solutions"],
    actionButtons: [
      { label: "Get Started", action: "get_started", variant: "primary" }
    ]
  };
};

// Smart suggestion generation based on context
const generateSmartSuggestions = (userMessage: string, userType: 'customer' | 'prospect', aiResponse: string): string[] => {
  const message = userMessage.toLowerCase();
  const response = aiResponse.toLowerCase();
  
  if (userType === 'customer') {
    if (message.includes('billing') || response.includes('billing')) {
      return ["Check payment status", "View usage metrics", "Upgrade plan", "Contact billing"];
    }
    if (message.includes('agent') || message.includes('performance')) {
      return ["Agent performance", "Create new agent", "Training tips", "Analytics dashboard"];
    }
    return ["Agent optimization", "View analytics", "Billing questions", "Technical support"];
  } else {
    if (message.includes('price') || response.includes('pricing')) {
      return ["Schedule demo", "Compare plans", "ROI calculator", "Enterprise pricing"];
    }
    if (message.includes('demo') || response.includes('demo')) {
      return ["15-min overview", "30-min deep dive", "Industry demo", "Technical demo"];
    }
    if (message.includes('security') || response.includes('compliance')) {
      return ["HIPAA details", "SOC 2 info", "Security whitepaper", "Compliance guide"];
    }
    return ["Platform overview", "Schedule demo", "Pricing info", "Industry solutions"];
  }
};

// Smart action button generation
const generateSmartActionButtons = (userMessage: string, userType: 'customer' | 'prospect') => {
  const message = userMessage.toLowerCase();
  
  if (message.includes('demo') || message.includes('see it') || message.includes('show me')) {
    return [
      { label: "Schedule Demo", action: "schedule_demo", variant: "primary" as const },
      { label: "Watch Video", action: "demo_video", variant: "secondary" as const }
    ];
  }
  
  if (message.includes('price') || message.includes('cost')) {
    return [
      { label: "View Pricing", action: "view_pricing", variant: "primary" as const },
      { label: "Schedule Demo", action: "schedule_demo", variant: "secondary" as const }
    ];
  }

  if (message.includes('integration') || message.includes('connect')) {
    return [
      { label: "See Integrations", action: "view_integrations", variant: "primary" as const }
    ];
  }

  if (userType === 'customer' && (message.includes('agent') || message.includes('performance'))) {
    return [
      { label: "Agent Dashboard", action: "agent_dashboard", variant: "primary" as const }
    ];
  }
  
  return [
    { label: "Get Started", action: "get_started", variant: "primary" as const }
  ];
};

export default { generateAriaResponse };