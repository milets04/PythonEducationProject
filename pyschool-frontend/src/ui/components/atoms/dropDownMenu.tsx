"use client";

import React, { useState } from "react";
import { IconType } from "react-icons";
import { FiChevronDown } from "react-icons/fi";

type SubItem = {
  label: string;
  onClick?: () => void;
};

type DropDownItem = {
  label: string;
  onClick?: () => void;
  subItems?: SubItem[];
};

interface DropDownMenuProps {
  label: string;
  items: DropDownItem[];
  onAdd?: () => void;
  className?: string;
  isNested?: boolean;
  icon?: IconType;
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({
  label,
  items,
  onAdd,
  className = "",
  isNested = false,
  icon: Icon = FiChevronDown,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`flex flex-col text-[#4a3fb3] ${isNested ? "ml-6" : "ml-0"} ${className}`}
      style={{
        fontFamily: "Roboto, sans-serif",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 hover:opacity-80 transition-opacity"
      >
        <Icon
          size={14}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
        <span className="text-sm font-normal">{label}</span>
      </div>
      {isOpen && (
        <div className="flex flex-col mt-1 ml-5 space-y-1">
          {items.map((item, index) => (
            <div key={index}>
              <div
                onClick={item.onClick}
                className="text-sm text-[#4a3fb3] hover:underline"
              >
                {item.label}
              </div>
              {item.subItems && (
                <DropDownMenu
                  label=""
                  items={item.subItems}
                  isNested={true}
                  icon={Icon}
                />
              )}
            </div>
          ))}
          {onAdd && (
            <div
              onClick={onAdd}
              className="text-sm text-[#4a3fb3] mt-2 hover:underline"
            >
              + Topic
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropDownMenu;
