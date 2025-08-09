import React, { useState } from 'react';
import { MessageSquare, Crown } from 'lucide-react'; // Removed Phone
import AriaAgent from './AriaAgent';
import AtlasAgent from './AtlasAgent';
// Ensure correct import path for CallWidget
import CallWidget from '../CallFeature/CallWidget';

interface AIAgentManagerProps {
  userType: 'customer' | 'prospect' | 'admin';
  userName?: string;
}

const AIAgentManager: React.FC<AIAgentManagerProps> = ({ userType, userName }) => {
  const [showAria, setShowAria] = useState(false);
  const [showAtlas, setShowAtlas] = useState(false);
  const [showCall, setShowCall] = useState(false); // State to control CallWidget visibility

  return (
    <div className="relative">
      {/* Aria Agent (Chat for Customer/Prospect) */}
      {(userType === 'customer' || userType === 'prospect') && (
        <>
          <button
            onClick={() => setShowAria(true)}
            onKeyPress={(e) => e.key === 'Enter' && setShowAria(true)}
            aria-label="Open chat with Aria - Customer Success Agent"
            className="fixed bottom-4 right-4 bg-gradient-to-r from-orange-500 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-40 group"
          >
            <MessageSquare className="w-6 h-6" />
            <div className="absolute right-16 bottom-4 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Chat with Aria - Customer Success Agent
            </div>
          </button>
          <AriaAgent
            isVisible={showAria}
            onClose={() => setShowAria(false)}
            userType={userType}
            userName={userName}
          />
        </>
      )}

      {/* Call Widget and its button - ONLY FOR ADMIN */}
      {userType === 'admin' && ( // Changed condition to only render for 'admin'
        <>
          {/* This button is now redundant as we added a toggle in Dashboard.tsx
              However, if you want a separate call button directly controlled by AIAgentManager
              for admins, you can keep this. Otherwise, it can be removed.
              For now, I'm commenting it out to avoid duplicate functionality if Dashboard.tsx's button is used.
          */}
          {/*
          <button
            onClick={() => setShowCall(true)}
            onKeyPress={(e) => e.key === 'Enter' && setShowCall(true)}
            aria-label="Start voice call with support"
            className="fixed bottom-4 right-20 bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-40 group"
          >
            <Phone className="w-6 h-6" />
            <div className="absolute right-16 bottom-4 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Call Support
            </div>
          </button>
          */}
          
          {/* The CallWidget itself will be controlled by the Dashboard's state when userType is 'admin' */}
          {/* This instance of CallWidget in AIAgentManager will only be visible if showCall is true.
              If you intend for the Dashboard to control the CallWidget's visibility entirely,
              you might remove this CallWidget instance from here and only render it in Dashboard.tsx.
              For now, I'm keeping it here, but it will only activate if showCall is toggled.
          */}
          <CallWidget
            isVisible={showCall} // This showCall state is local to AIAgentManager
            onClose={() => setShowCall(false)}
            userType={userType} // <--- Added this line to pass the userType prop
          />
        </>
      )}

      {/* Atlas Agent (Chat for Admin) */}
      {userType === 'admin' && (
        <>
          <button
            onClick={() => setShowAtlas(true)}
            onKeyPress={(e) => e.key === 'Enter' && setShowAtlas(true)}
            aria-label="Open chat with Atlas - Super Admin Assistant"
            className="fixed bottom-4 right-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-40 group"
          >
            <Crown className="w-6 h-6" />
            <div className="absolute right-16 bottom-4 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Chat with Atlas - Super Admin Assistant
            </div>
          </button>
          <AtlasAgent
            isVisible={showAtlas}
            onClose={() => setShowAtlas(false)}
            adminName={userName}
          />
        </>
      )}
    </div>
  );
};

export default AIAgentManager;
