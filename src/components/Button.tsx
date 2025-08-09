import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  // Added className prop
  className?: string; 
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
  return (
    // Pass the className to the native button element
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};
