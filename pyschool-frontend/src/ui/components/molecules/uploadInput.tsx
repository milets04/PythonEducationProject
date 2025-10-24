import * as React from 'react';
import { Button } from '@/ui/components/atoms/button'; // tu botón reutilizable

interface UploadInputProps {
  label: string;
  onUpload: (file: File | null) => void;
}

const UploadInput: React.FC<UploadInputProps> = ({ label, onUpload }) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    onUpload(file);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <div className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 bg-white">
        <span className="text-gray-500 text-sm truncate">No file chosen</span>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          className="hidden"
        />
        <Button
          type="button"
          onClick={handleClick}
          className="bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          Upload
        </Button>
      </div>
    </div>
  );
};

export default UploadInput;
