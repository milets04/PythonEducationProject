import * as React from 'react';

interface InputProps {
  id?: string;
  value: string;
  label?: string;
  className?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  id = 'input-id',
  value,
  label = '',
  className = '',
  placeholder = '',
  onChange,
}) => {
  return (
    <>
    <div className="relative w-full">
        {label && (
        <label htmlFor={id} className="absolute left-2.5 -top-2 inline-block bg-white text-xs font.bold text-gray-700 ">
          {label}
        </label>
      )}
      <input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 ${className}`}
      />
    </div>  
    </>
  );
};

export default Input;