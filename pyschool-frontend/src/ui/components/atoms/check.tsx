// ui/components/atoms/check.tsx
import React from 'react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked = false, onChange }) => {
  return (
    <div className="relative inline-block">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-5 w-5 rounded border-2 border-gray-300 
            text-[#06538D] 
            focus:ring-2 focus:ring-[#06538D] 
            cursor-pointer
            checked:bg-[#06538D]
            checked:border-[#06538D]
          "
        />
      </label>
    </div>
  );
}

export default Checkbox;