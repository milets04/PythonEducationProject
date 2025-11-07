import * as React from 'react';
import { Button } from '@/ui/components/atoms/button'; // tu botón reutilizable

interface UploadInputProps {
  label: string;
  onUpload: (fileOrUrl: File | string | null) => void;
}

const UploadInput: React.FC<UploadInputProps> = ({ label, onUpload }) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [value, setValue] = React.useState<string>("");

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setValue(file.name);
      onUpload(file);
    } else {
      setValue("");
      onUpload(null);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setValue(url);
    onUpload(url || null);
  };

  const handleClear = () => {
    setValue("");
    onUpload(null);
  };

  // 🔹 Campos que usarán URL en lugar de archivos
  const usesUrl = ["Videos", "Images", "Presentation","Audio"].includes(label);

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>

      {usesUrl ? (
        // Campo para URL
        <div className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 bg-white">
          <input
            type="url"
            value={value}
            onChange={handleUrlChange}
            placeholder={`Enter ${label.toLowerCase()} URL (e.g., https://...)`}
            className="w-full text-sm text-gray-700 bg-transparent focus:outline-none"
          />
          <Button
            type="button"
            onClick={handleClear}
            className="bg-gray-100 text-gray-600 hover:bg-gray-200 ml-2"
          >
            Clear
          </Button>
        </div>
      ) : (
        // Campo de carga de archivo (solo Audio)
        <div className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 bg-white">
          <span className="text-gray-500 text-sm truncate w-2/3">
            {value || "No file chosen"}
          </span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
            className="hidden"
            accept={label === "Audio" ? "audio/*" : "*"}
          />
          <Button
            type="button"
            onClick={handleClick}
            className="bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            {value ? "Change" : "Upload"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadInput;
