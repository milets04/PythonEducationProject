import React, { useState } from 'react';

const Checkbox: React.FC = () => {
  const [checked, setChecked] = useState(false);
      return (
        <div className="relative inline-block">
          <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
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