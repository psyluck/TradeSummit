// src/components/CallWidget.tsx
import React from 'react';
// Update the import path below to the actual location of your Button component
import { Button } from "../Button.tsx"; 
// The Input and useToast imports are no longer needed for inbound-only functionality,
// but I'll leave them commented out in case you re-introduce them later.
// import { Input } from './ui/input';
// import { useToast } from './ui/use-toast';

interface CallWidgetProps {
  isVisible: boolean;
  onClose: () => void;
  // Added userType prop back
  userType: 'customer' | 'prospect' | 'admin'; 
}

const CallWidget: React.FC<CallWidgetProps> = ({ isVisible, onClose, userType }) => {
  // Removed phoneNumber and callStatus states as they are for outbound calls
  // Removed handleCall and handleEndCall functions as they are for outbound calls
  // Removed useToast as it was primarily used for outbound call feedback

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-lg p-6 max-w-md z-50">
      {/* Using userType in the heading to resolve the ESLint warning */}
      <h3 className="text-lg font-semibold mb-4">Inbound Call Feature ({userType})</h3>
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-gray-600 text-center">
          This widget is for handling **inbound calls only**. 
          <br />Waiting for a new call to come in...
        </p>
        
        {/* You can add UI here to indicate an incoming call or an "Answer" button 
            when an inbound call is detected by your backend system. */}
        
        <Button 
          onClick={onClose}
          className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded-md"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default CallWidget;
