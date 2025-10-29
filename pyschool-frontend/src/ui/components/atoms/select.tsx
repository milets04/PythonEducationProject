"use client";
import React, { useState } from "react";

const Select: React.FC = () => {
  const [role, setRole] = useState<"Student" | "Teacher">("Student");

  const toggleRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "Student" | "Teacher";
    setRole(value);
  };

  return (
    <div className="relative inline-block">
      <select
        value={role}
        onChange={toggleRole}
        className="
          appearance-none
          bg-transparent
          border-none
          text-sm        
          font-normal   
          cursor-pointer
          pr-5
          focus:outline-none
        "
        style={{
          fontFamily: "Roboto, sans-serif",
        }}
      >
        <option value={role}>{role}</option>
        <option value={role === "Student" ? "Teacher" : "Student"}>
          {role === "Student" ? "Teacher" : "Student"}
        </option>
      </select>
      <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-base">
        ▼
      </span>
    </div>
  );
};

export default Select;