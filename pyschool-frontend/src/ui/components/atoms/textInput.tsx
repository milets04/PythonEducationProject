import * as React from 'react';

interface TextareaProps {
  id?: string;
  value: string;
  label?: string;
  className?: string;
  placeholder?: string;
  rows?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea: React.FC<TextareaProps> = ({
  id = 'textarea-id',
  value,
  label = '',
  className = '',
  placeholder = '',
  rows = 4,
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
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none mb-0 text-gray-800 text-sm leading-relaxed resize-y bg-white ${className}`}
      />
    </div>
  );
};

export default Textarea;
