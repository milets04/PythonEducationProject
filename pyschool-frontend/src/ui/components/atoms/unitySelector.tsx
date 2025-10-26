"use client";

import React, { ChangeEvent } from 'react';
export interface UnityOption {
  value: string | number;
  label: string;
}

interface UnitySelectorProps {
  value: string | number;
  options: UnityOption[];
  onChange?: (newValue: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const UnitySelector: React.FC<UnitySelectorProps> = ({
  value,
  options = [],
  onChange,
  placeholder,
  disabled = false,
}) => {
  
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <>
      <div className="select-wrapper">
        <select
          className="select-element"
          value={value}
          onChange={handleChange}
          disabled={disabled}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <span className="select-arrow" aria-hidden="true">
          v
        </span>
      </div>

      <style jsx>{`
        .select-wrapper {
          position: relative;
          display: inline-block; 
        }

        .select-element {
          appearance: none; 
          -webkit-appearance: none;
          -moz-appearance: none;
          background-color: transparent;
          border: none;
          padding: 0;
          margin: 0;

          font-size: 28px; 
          font-weight: 500;
          color: #000;

          padding-right: 10px; 
          cursor: pointer;
        }

        .select-element:disabled {
          color: #999;
          cursor: not-allowed;
        }

        .select-arrow {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          font-size: 20px;
          color: #000;
          pointer-events: none; 
        }
      `}</style>
    </>
  );
};

export default UnitySelector;