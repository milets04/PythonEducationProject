import React from 'react';

interface CustomButtonProps {
  text?: string;
  onClick?: () => void;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text = 'Log out',
  onClick,
  backgroundColor = '#1e3a8a', 
  textColor = '#ffffff', 
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor, color: textColor }}
      className={`px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity ${className}`}
    >
      {text}
    </button>
  );
};

export default CustomButton;