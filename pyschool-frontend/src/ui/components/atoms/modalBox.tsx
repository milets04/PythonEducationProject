"use client";
import React from "react";
import CustomButton from "@/ui/components/atoms/btnOthers";

interface ModalBoxProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

const ModalBox: React.FC<ModalBoxProps> = ({
  title,
  isOpen,
  onClose,
  onConfirm,
  children,
  confirmText = "Save",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#C9DDDC]/60 z-50">
      <div
        className="bg-white p-6 rounded-2xl shadow-lg w-[340px] flex flex-col gap-4 transform transition-all duration-300 scale-100"
        style={{ fontFamily: "Roboto, sans-serif" }}
      >
        <h3 className="text-lg font-semibold text-gray-800 text-center">
          {title}
        </h3>

        <div>{children}</div>

        <div className="flex justify-end gap-3 mt-3">
          <CustomButton
            text={cancelText}
            onClick={onClose}
            backgroundColor="#C9DDDC"
            textColor="#000000"
            className="!px-4 !py-2 !text-sm font-roboto"
          />
          {onConfirm && (
            <CustomButton
              text={confirmText}
              onClick={onConfirm}
              backgroundColor="#1e3a8a"
              textColor="#ffffff"
              className="!px-4 !py-2 !text-sm font-roboto"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalBox;
