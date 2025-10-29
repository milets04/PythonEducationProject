// ui/components/atoms/select.tsx
import React from 'react';

interface SelectProps {
  value?: number;
  onChange?: (value: number) => void;
}

const Select: React.FC<SelectProps> = ({ value = 1, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(parseInt(e.target.value));
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className="
        px-3 py-2
        bg-white
        border border-gray-300
        rounded-md
        text-sm
        text-gray-700
        focus:outline-none
        focus:ring-2
        focus:ring-[#06538D]
        focus:border-transparent
        cursor-pointer
        hover:border-gray-400
        transition-colors
      "
    >
      <option value={1}>Student</option>
      <option value={2}>Editor Teacher</option>
      <option value={3}>Executor Teacher</option>
      <option value={4}>Administrator</option>
    </select>
  );
};

export default Select;