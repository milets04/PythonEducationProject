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
    <div className="relative w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none  ${className}`}
      />
    </div>
  );
};

export default Input;
