import React from 'react';
import { IconType } from 'react-icons';
import Input from '@/ui/components/atoms/input';
import InputIcon from '@/ui/components/atoms/icons';

interface InputWithIconProps {
  id?: string;
  value: string;
  label?: string;
  placeholder?: string;
  icon: IconType;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const InputWithIcon: React.FC<InputWithIconProps> = ({
  id = 'input-id',
  value,
  label = '',
  placeholder = '',
  icon,
  onChange,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-tLog text-tLog mb-2">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <InputIcon icon={icon} />
        </div>
        <input
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border border-gray-300 rounded-md pl-12 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300`}
        />
      </div>
    </div>
  );
};

export default InputWithIcon;