import React from "react";
import TableClientes from "@/components/layout/TableClientes";

export default function Clientes() {
  return (
    <div className="p-5">
      <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-3xl overflow-hidden w-full">
        <div className="p-5">
          <TableClientes />
        </div>
      </div>
    </div>
  );
}
