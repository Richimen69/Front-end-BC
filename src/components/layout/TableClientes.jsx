import React from "react";
import { useState, useEffect } from "react";
import { obtenerClientes } from "@/services/clientes";
export default function TableClientes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Solicitar opciones al backend
    const fetchClientes = async () => {
      try {
        const response = await obtenerClientes();
        setClientes(response);
      } catch (error) {
        console.error("Error al obtener las opciones:", error);
      }
    };

    fetchClientes();
  }, []);
  const filteredClientes = clientes.filter((dato) => {
    if (!dato.folio_re) return true;
    return dato.folio_re.toLowerCase().includes(searchQuery.toLowerCase());
  });
  return (
    <div className="w-full">
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Contacto
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Telefono
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Correo
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Observaciones
                </th>
              </tr>
            </thead>
            <tbody>
              {clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <tr
                    key={cliente.id_cli}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 text-nowrap">
                      {cliente.nombre_cli}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 text-nowrap">
                      {cliente.contacto_cli}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {cliente.telefono_cli}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {cliente.correo_cli}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {cliente.tipo_cliente}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {cliente.observaciones}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="p-4 text-center text-gray-600">
                    No se encontraron trámites.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
