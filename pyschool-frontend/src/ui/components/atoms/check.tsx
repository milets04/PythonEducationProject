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
          className="h-4 w-4 accent-[#06538D] cursor-pointer
            bg-transparent
            border-none
            text-sm        
            pr-5
            focus:outline-none
          "
        />
      </label>
    </div>
  );
}

export default Checkbox;