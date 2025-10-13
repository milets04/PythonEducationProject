import React, { useState } from 'react';

const Checkbox: React.FC = () => {
  const [checked, setChecked] = useState(false);
      return (
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="h-4 w-4 accent-[#06538D] cursor-pointer"
          />
          Remember me
        </label>
      );
    }

    export default Checkbox;