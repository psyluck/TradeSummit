import React, { useEffect, useState } from 'react'; // Added useState
import { 
  Zap,            // Used in quick actions
  CreditCard,     // Used in payment banner
  Phone,          // Used for Aria indicator
  ArrowUpRight,   // Used in stat cards
  ArrowDownRight, // Used in stat cards
  BarChart3       // Used in stat cards and quick actions
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
// Corrected import path for CallWidget
import CallWidget from '../CallFeature/CallWidget'; // Updated import path

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [userOrganization, setUserOrganization] = useState<{ name: string } | null>(null);
  const [agents, setAgents] = useState<Array<{
    id: number;
    name: string;
    conversations: number;
    satisfaction: number;
    status: 'active' | 'inactive';
    call_enabled: boolean;
    call_direction: 'inbound' | 'outbound' | 'both';
  }>>([]);

  // State to control the visibility of the CallWidget
  const [showCallWidget, setShowCallWidget] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Example: Replace with your actual user retrieval logic
      const { data: userDataResult } = await supabase.auth.getUser();
      const user = userDataResult?.user;
      if (!user || !user.email) {
        throw new Error('User not found or not authenticated');
      }
      const { data: userData } = await supabase
        .from('users')
        .select('*, organization:organizations(*)')
        .eq('email', user.email)
        .single();
      if (userData?.organization) {
        setUserOrganization(userData.organization);
        // Example: Load agents data (replace with actual fetch logic)
        setAgents([
          {
            id: 1,
            name: 'Aria',
            conversations: 500,
            satisfaction: 95,
            status: 'active',
            call_enabled: true,
            call_direction: 'both',
          },
          {
            id: 2,
            name: 'Leo',
            conversations: 300,
            satisfaction: 88,
            status: 'inactive',
            call_enabled: false,
            call_direction: 'inbound',
          },
          {
            id: 3,
            name: 'Nova',
            conversations: 445,
            satisfaction: 90,
            status: 'active',
            call_enabled: true,
            call_direction: 'outbound',
          },
        ]);
        // ... existing data loading logic ...
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handler for changing call direction
  const handleDirectionChange = (agentId: number, direction: 'inbound' | 'outbound' | 'both') => {
    setAgents(prevAgents =>
      prevAgents.map(agent =>
        agent.id === agentId ? { ...agent, call_direction: direction } : agent
      )
    );
    // Optionally, add API call here to persist change
  };

  // Handler for toggling call feature
  const handleCallToggle = (agentId: number, enabled: boolean) => {
    setAgents(prevAgents =>
      prevAgents.map(agent =>
        agent.id === agentId ? { ...agent, call_enabled: enabled } : agent
      )
    );
    // Optionally, add API call here to persist change
  };

  // Stat cards data
  const statCards = [
    {
      title: 'Conversations',
      value: '1,245',
      change: '+12%',
      trend: 'up',
      color: 'from-orange-500 to-amber-500',
      icon: BarChart3,
    },
    {
      title: 'Satisfaction',
      value: '92%',
      change: '+3%',
      trend: 'up',
      color: 'from-emerald-500 to-green-500',
      icon: ArrowUpRight,
    },
    {
      title: 'Agents',
      value: '8',
      change: '0%',
      trend: 'up',
      color: 'from-blue-500 to-indigo-500',
      icon: Phone,
    },
    {
      title: 'Calls',
      value: '320',
      change: '-5%',
      trend: 'down',
      color: 'from-purple-500 to-pink-500',
      icon: CreditCard,
    },
  ];

  // Recent activity sample data
  const recentActivity = [
    {
      message: 'Agent Aria handled a new conversation',
      time: '2 minutes ago',
      status: 'success',
    },
    {
      message: 'Agent Leo missed a call',
      time: '10 minutes ago',
      status: 'warning',
    },
    {
      message: 'Agent Nova updated configuration',
      time: '1 hour ago',
      status: 'info',
    },
  ];

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back{userOrganization ? `, ${userOrganization.name}` : ''}!
          </h1>
          <p className="text-slate-600">Monitor your AI agents' performance and activity</p>
        </div>

        {/* Payment Status Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Professional Plan Active</h3>
                <p className="text-emerald-100">Next billing: January 15, 2025 • $2,500/month</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">✓ Paid</div>
              <div className="text-sm text-emerald-100">Via Stripe</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.title}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Conversation Volume</h3>
              <div className="flex items-center space-x-4">
                <button className="text-sm text-slate-600 hover:text-orange-600 transition-colors">7 days</button>
                <button className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-lg">30 days</button>
                <button className="text-sm text-slate-600 hover:text-orange-600 transition-colors">90 days</button>
              </div>
            </div>
            
            {/* Chart Placeholder */}
            <div className="h-64 bg-gradient-to-t from-orange-50 to-transparent rounded-lg flex items-end justify-between p-4">
              {/* Chart bars would go here */}
            </div>
            
            <div className="flex items-center justify-between mt-4 text-sm text-slate-600">
              <span>Jan 1</span>
              <span>Jan 15</span>
              <span>Jan 30</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-emerald-500' :
                    activity.status === 'warning' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 font-medium">{activity.message}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium">
              View all activity
            </button>
          </div>
        </div>

        {/* Agent Configuration Table */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Agent Configuration</h3>
            <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              View All Agents
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Agent Name</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Conversations</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Satisfaction</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Status</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Call Feature</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Call Direction</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-orange-50 transition-colors">
                    <td className="py-4">
                      <div className="font-medium text-slate-900 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-500" />
                        {agent.name}
                      </div>
                    </td>
                    <td className="py-4 text-slate-600">{agent.conversations.toLocaleString()}</td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="text-slate-900 font-medium">{agent.satisfaction}%</div>
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${agent.satisfaction}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        agent.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <label className="swap">
                        <input
                          type="checkbox"
                          checked={agent.call_enabled}
                          onChange={e => handleCallToggle(agent.id, e.target.checked)}
                          disabled={agent.name === 'Aria'}
                        />
                        <div className="swap-on">Enabled</div>
                        <div className="swap-off">Disabled</div>
                      </label>
                    </td>
                    <td className="py-4">
                      <select
                        value={agent.call_direction}
                        onChange={e => handleDirectionChange(agent.id, e.target.value as 'inbound' | 'outbound' | 'both')}
                        disabled={agent.name === 'Aria'}
                        className="select select-bordered w-full max-w-xs"
                      >
                        <option value="inbound">Inbound Only</option>
                        <option value="outbound">Outbound Only</option>
                        <option value="both">Both Directions</option>
                      </select>
                    </td>
                    <td className="py-4">
                      <button 
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                        disabled={agent.name === 'Aria'}
                      >
                        Configure
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-orange-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="w-8 h-8" />
              <h4 className="text-lg font-bold">Create New Agent</h4>
            </div>
            <p className="text-orange-100 mb-4">Deploy a new AI agent in minutes with our templates</p>
            <button className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
              Get Started
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-8 h-8 text-emerald-600" />
              <h4 className="text-lg font-bold text-slate-900">View Analytics</h4>
            </div>
            <p className="text-slate-600 mb-4">Deep dive into performance metrics and insights</p>
            <button className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
              Open Analytics →
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="w-8 h-8 text-purple-600" />
              <h4 className="text-lg font-bold text-slate-900">Billing & Usage</h4>
            </div>
            <p className="text-slate-600 mb-4">Manage payments and view usage metrics</p>
            <button className="text-purple-600 font-medium hover:text-purple-700 transition-colors">
              View Billing →
            </button>
          </div>
        </div>

        {/* Button to toggle CallWidget visibility */}
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => setShowCallWidget(!showCallWidget)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Phone className="w-5 h-5" />
            <span>{showCallWidget ? 'Hide Inbound Call Status' : 'Show Inbound Call Status'}</span>
          </button>
        </div>

      </div> {/* End of max-w-7xl mx-auto */}

      {/* Render CallWidget conditionally */}
      <CallWidget 
        isVisible={showCallWidget} 
        onClose={() => setShowCallWidget(false)} 
        userType="admin" // Assuming the dashboard user is an admin
      />
    </div>
  );
};

export default Dashboard;
