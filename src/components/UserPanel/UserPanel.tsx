import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import AgentBuilder from './AgentBuilder';

const UserPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showWelcome, setShowWelcome] = useState(true);

  // Show welcome message when panel first loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'agents':
        return <AgentBuilder />;
      case 'conversations':
        return (
          <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Conversations</h1>
              <p className="text-slate-600 mb-8">Monitor and manage all customer conversations</p>
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-orange-200 text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Conversations Coming Soon</h3>
                <p className="text-slate-600">Real-time conversation monitoring and management tools</p>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics</h1>
              <p className="text-slate-600 mb-8">Deep insights into your AI agents' performance</p>
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-orange-200 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Advanced Analytics Coming Soon</h3>
                <p className="text-slate-600">Comprehensive performance metrics and business insights</p>
              </div>
            </div>
          </div>
        );
      case 'integrations':
        return (
          <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Integrations</h1>
              <p className="text-slate-600 mb-8">Connect your AI agents with your favorite tools</p>
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-orange-200 text-center">
                <div className="text-6xl mb-4">🔗</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Integration Hub Coming Soon</h3>
                <p className="text-slate-600">Easy setup for Salesforce, HubSpot, Shopify, and more</p>
              </div>
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Team Management</h1>
              <p className="text-slate-600 mb-8">Manage team members and permissions</p>
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-orange-200 text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Team Features Coming Soon</h3>
                <p className="text-slate-600">Role-based access control and team collaboration tools</p>
              </div>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Billing & Usage</h1>
              <p className="text-slate-600 mb-8">Manage your subscription and view usage metrics</p>
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-orange-200 text-center">
                <div className="text-6xl mb-4">💳</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Billing Dashboard Coming Soon</h3>
                <p className="text-slate-600">Subscription management and usage tracking</p>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
              <p className="text-slate-600 mb-8">Configure your account and preferences</p>
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-orange-200 text-center">
                <div className="text-6xl mb-4">⚙️</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Settings Panel Coming Soon</h3>
                <p className="text-slate-600">Account settings, security, and preferences</p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>

      {/* Welcome Toast */}
      {showWelcome && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-orange-500 to-blue-600 text-white p-4 rounded-xl shadow-2xl z-50 max-w-sm">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              👑
            </div>
            <div>
              <h4 className="font-bold text-sm">Welcome to TradeSummit!</h4>
              <p className="text-xs text-orange-100 mt-1">
                Atlas, your Super Admin Assistant, is ready to help. Click the crown icon to get started!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPanel;