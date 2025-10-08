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
    <h1 className={`text-2xl text-cyan-700 mb-0 ${className}`} style={{ fontFamily: 'var(--font-sign)', fontWeight: 700, color:'var(--color-sign)' }}>      
        {text}
    </h1>
    );  
}

export default Title;