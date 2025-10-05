import React from 'react';
import { IconType } from 'react-icons';

interface InputIconProps {
  icon: IconType;
  className?: string;
}

const InputIcon: React.FC<InputIconProps> = ({
  icon: Icon,
  className = '',
}) => {
  return (
    <Icon 
      className={`text-black ${className}`}
      style={{ width: '17px', height: '20px' }}
    />
  );
};

export default InputIcon;