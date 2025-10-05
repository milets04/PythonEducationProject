import React, { useState } from 'react';

interface EditableSignInTextProps {
  initialText?: string;
  onTextChange?: (newText: string) => void;
  className?: string;
  editable?: boolean;
}

const EditableSignInText: React.FC<EditableSignInTextProps> = ({
  initialText = 'Sign in',
  onTextChange,
  className = '',
  editable = true,
}) => {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);

  const handleBlur = () => {
    setIsEditing(false);
    if (onTextChange) {
      onTextChange(text);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  if (!editable) {
    return (
      <span className={`text-4xl font-light text-blue-600 ${className}`}>
        {text}
      </span>
    );
  }

  return (
    <>
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className={`text-4xl font-light text-blue-600 bg-transparent border-b-2 border-blue-400 outline-none ${className}`}
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className={`text-4xl font-tituloPrin font-light text-blue-600 cursor-pointer hover:opacity-80 transition-opacity ${className}`}
        >
          {text}
        </span>
      )}
    </>
  );
};

export default EditableSignInText;