import React from 'react';

interface titleProps {
  text: string;
  className?: string;
}

const Title: React.FC<titleProps> = ({
  text ='',
  className = '',
}) => {
  return (
    <h1 className={`text-2xl text-cyan-600 ${className}`} style={{ fontFamily: 'var(--font-tLog)' }}>      
        {text}
    </h1>
    );  
}

export default Title;