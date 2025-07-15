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
          <TableClientes />
        </div>
        {showDialog && <FormCliente onClose={() => setShowDialog(false)} />}
        <Toaster position="top-center" richColors />
      </div>
    </div>
  );
}
