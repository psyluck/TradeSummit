import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import IndustryShowcase from './components/IndustryShowcase';
import ComplianceSection from './components/ComplianceSection';
import IntegrationsHub from './components/IntegrationsHub';
import PlatformFeatures from './components/PlatformFeatures';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import UserPanel from './components/UserPanel/UserPanel';
import AIAgentManager from './components/AIAgents/AIAgentManager';
import { PaymentProvider } from './components/Payment/PaymentProvider';

function App() {
  const [showUserPanel, setShowUserPanel] = useState(false);

  if (showUserPanel) {
    return (
      <PaymentProvider>
        <UserPanel />
        <AIAgentManager userType="admin" userName="John Doe" />
      </PaymentProvider>
    );
  }

  return (
    <PaymentProvider>
      <div className="min-h-screen font-inter bg-gradient-to-br from-orange-50 to-amber-50">
        <Header />
        <Hero />
        <IndustryShowcase />
        <ComplianceSection />
        <IntegrationsHub />
        <PlatformFeatures />
        <Pricing />
        <Footer />
        
        {/* The "View Demo Panel" button has been removed from here. */}
        {/* If you need to access the UserPanel, you'll need another way to toggle showUserPanel to true,
            perhaps through a login process or a different navigation element. */}

        {/* AI Agent for prospects */}
        <AIAgentManager userType="prospect" />
      </div>
    </PaymentProvider>
  );
}

export default App;
