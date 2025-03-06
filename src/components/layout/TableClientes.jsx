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
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Nombre
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Telefono
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Correo
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Empresa
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                DIRECCIÓN
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
                  <td className="px-4 py-3 text-gray-600">
                    {cliente.telefono_cli}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {cliente.correo_cli}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {cliente.empresa_cli}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {cliente.calle_cli}, {cliente.num_ext_cli}, {cliente.num_int_cli}, {cliente.colonia_cli}, {cliente.cp_cli},{cliente.municipio_cli}, {cliente.estado_cli}, 
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
  );
}
