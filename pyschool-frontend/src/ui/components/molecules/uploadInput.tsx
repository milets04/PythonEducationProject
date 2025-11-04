import * as React from 'react';
import { Button } from '@/ui/components/atoms/button'; // tu botón reutilizable

interface UploadInputProps {
  label: string;
  onUpload: (fileOrURrl: File | string | null) => void;
}

const UploadInput: React.FC<UploadInputProps> = ({ label, onUpload }) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = React.useState<string>("");

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFileName(file.name); // guarda nombre archivo
      onUpload(file); // Llama al callback de CreateTopic
    } else {
      setFileName("");
      onUpload(null);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setFileName(url);
    onUpload(url || null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {label === "Videos" ? (
        //URL para videos
        <div className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 bg-white">
        <input
          type="url"
          value={fileName}
          onChange={handleUrlChange}
          placeholder="Enter video URL (e.g., https://youtu.be/...)"
          className="w-full text-sm text-gray-700 bg-transparent focus:outline-none"
        />
        <Button
          type="button"
          onClick={() => setFileName("")}
          className="bg-gray-100 text-gray-600 hover:bg-gray-200 ml-2"
        >
          Clear
        </Button>
      </div>
      ) : (
      <div className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 bg-white">
        <span className="text-gray-500 text-sm truncate w-2/3">{fileName || "No file chosen"}</span>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          className="hidden"
          accept={
              label === "Images"
              ? "image/*"
              : label === "Audio"
              ? "audio/*"
              : label === "Presentation"
              ? ".pdf,.ppt,.pptx,.key"
              : "*"
          }
        />
        <Button
          type="button"
          onClick={handleClick}
          className="bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          {fileName ? "Change" : "Upload"}
        </Button>
      </div>
      )}
    </div>
  );
};

export default UploadInput;
