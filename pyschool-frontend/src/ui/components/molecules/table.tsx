"use client";
import React from "react";
import Select from "@/ui/components/atoms/select";
import CoverDescriptionText from "@/ui/components/atoms/coverDescriptionText";
import Checkbox from "../atoms/check";

export interface User {
  id: number;
  firstName: string;
  email: string;
  newRoleId?: number; // ← Cambié de roleId a newRoleId
  isSelected?: boolean; // ← Cambié de selected a isSelected
}

interface TableProps {
  data: User[];
  onToggleSelection: (userId: number) => void;
  onRoleChange: (userId: number, newRoleId: number) => void;
}

const Table: React.FC<TableProps> = ({ data, onToggleSelection, onRoleChange }) => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-4 sm:p-6 overflow-x-auto">
      <div className="w-full border-b border-gray-400 pb-2 grid grid-cols-[1.5fr_2fr_1fr_0.5fr] gap-4 text-center">
        <CoverDescriptionText text="Name" size="small" className="text-sm font-semibold" />
        <CoverDescriptionText text="Email" size="small" className="text-sm font-semibold" />
        <CoverDescriptionText text="Role" size="small" className="text-sm font-semibold" />
        <CoverDescriptionText text="Actions" size="small" className="text-sm font-semibold" />
      </div>

      <div className="divide-y divide-gray-200">
        {data?.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1.5fr_2fr_1fr_0.5fr] gap-4 text-center items-center
                py-3 sm:py-4 hover:bg-blue-100 transition"
            >
              <p className="text-sm sm:text-base text-gray-800" style={{ fontFamily: "Roboto, sans-serif" }}>
                {item.firstName}
              </p>
              <p className="text-sm sm:text-base text-gray-800" style={{ fontFamily: "Roboto, sans-serif" }}>
                {item.email}
              </p>
              <div className="flex justify-center">
                <Select
                  value={item.newRoleId} 
                  onChange={(value: number) => onRoleChange(item.id, value)}
                />
              </div>
              <div className="flex justify-center">
                <Checkbox
                  checked={item.isSelected}
                  onChange={() => onToggleSelection(item.id)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-6" style={{ fontFamily: "Roboto, sans-serif" }}>
            No hay registros disponibles
          </p>
        )}
      </div>
    </div>
  );
};

export default Table;