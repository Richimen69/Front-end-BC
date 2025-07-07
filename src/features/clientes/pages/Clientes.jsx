import React, { useState, useEffect } from "react";
import FormCliente from "@/features/clientes/components/forms/FormCliente";
import TableClientes from "@/features/clientes/components/tables/TableClientes";
import { Toaster } from "sonner";

export default function Clientes() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="p-5">
      <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-3xl overflow-hidden w-full">
        <div className="p-5 overflow-y-auto w-full">
          <div className="flex py-5 ">
            <button
              className="h-10 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-green-700 focus:outline-hidden focus:ring-2 focus:ring-green-500 text-nowrap"
              onClick={() => setShowDialog(true)}
            >
              Nuevo registro
            </button>
          </div>
          <TableClientes />
        </div>
        {showDialog && <FormCliente onClose={() => setShowDialog(false)} />}
        <Toaster position="top-center" richColors />
      </div>
    </div>
  );
}
