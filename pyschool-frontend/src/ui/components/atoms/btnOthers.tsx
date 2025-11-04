import React from 'react';

interface CustomButtonProps {
  text?: string;
  onClick?: () => void;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  disabled?: boolean; 
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text = 'Log out',
  onClick,
  backgroundColor = '#1e3a8a', 
  textColor = '#ffffff', 
  className = '',
  disabled = false, 
}) => {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor, color: textColor }}
      disabled={disabled}
      className={`
        px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''} // 4. (Opcional) Estilo para deshabilitado
        ${className}
      `}
    >
      {text}
    </button>
  );
};

export default CustomButton;