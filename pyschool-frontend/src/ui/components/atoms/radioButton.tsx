import * as React from "react";

interface RadioButtonProps {
  id?: string;
  name: string; // necesario para agrupar
  value: string;
  label: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  className = "",
}) => {
  const inputId = id || `${name}-${value}`;

  return (
    <div className="flex items-center space-x-2">
      <input
        id={inputId}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={`border border-gray-300 rounded-full focus:ring-2 focus:ring-cyan-500 ${className}`} 
        style={{ fontFamily: 'var(--font-sign)', fontWeight:400 }}
      />
      <label htmlFor={inputId} className="text-sm text-gray-700 cursor-pointer">
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
