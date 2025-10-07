import React from 'react';

interface descriptionProps {
  text: string;
  className?: string;
}

const descp: React.FC<descriptionProps> = ({
  text ='',
  className = '',
}) => {
  return (
    <h1 className={` text-gray-400 ${className}`} style={{ fontFamily: 'var(--font-sign)' }}>      
        {text}
    </h1>
    );  
}

export default descp;