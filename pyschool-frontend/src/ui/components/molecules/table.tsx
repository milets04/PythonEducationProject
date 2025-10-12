"use client";
import React from "react";
import Select from "@/ui/components/atoms/select";
import CoverDescriptionText from "@/ui/components/atoms/coverDescriptionText";

interface TableProps {
  data: {
    id: number | string;
    name: string;
    email: string;
    role: string;
  }[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-4 sm:p-6 overflow-x-auto">
      <div className="w-full border-b border-gray-400 pb-2 grid grid-cols-3 gap-4 text-center">
        <CoverDescriptionText
          text="Nombre"
          size="small"
          className="text-sm font-semibold"
        />
        <CoverDescriptionText
          text="Correo electrónico"
          size="small"
          className="text-sm font-semibold"
        />
        <CoverDescriptionText
          text="Rol"
          size="small"
          className="text-sm font-semibold"
        />
      </div>

      {/* Filas dinámicas */}
      <div className="divide-y divide-gray-200">
        {data?.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              className="
                grid grid-cols-3 gap-4 text-center items-center
                py-3 sm:py-4
                hover:bg-gray-50 transition
              "
            >
              <p
                className="text-sm sm:text-base text-gray-800"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {item.name}
              </p>
              <p
                className="text-sm sm:text-base text-gray-800"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {item.email}
              </p>
              <div className="flex justify-center">
                <Select />
              </div>
            </div>
          ))
        ) : (
          <p
            className="text-center text-gray-500 py-6"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            No hay registros disponibles
          </p>
        )}
      </div>
    </div>
  );
};

export default Table;
