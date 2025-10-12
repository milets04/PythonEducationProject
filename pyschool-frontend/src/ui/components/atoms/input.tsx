import * as React from 'react';

interface InputProps {
  id?: string;
  value: string;
  label?: string;
  className?: string;
  placeholder?: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  id = 'input-id',
  value,
  label = '',
  className = '',
  placeholder = '',
  type = 'text',
  onChange,
}) => {
  return (
    <>
    <div className="relative w-full">
        {label && (
        <label htmlFor={id} className="absolute left-2.5 -top-2 inline-block bg-white text-xs font-semibold text-gray-700 " >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring- focus:ring-gray-300 mb-0${className}`}
      />
    </div>  
    </>
  );
};

export default Input;