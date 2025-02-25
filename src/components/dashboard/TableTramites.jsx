import React from "react";
import { fetchTramites } from "@/services/tramitesClientes";
import { useEffect, useState } from "react";
import { statusStyles } from "@/utils/Constans";
import { useNavigate } from "react-router-dom";
export default function TableTramites({ tipo }) {
  let filteredClientes = [];
  const [clientes, setClientes] = useState([]);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await fetchTramites();
        setClientes(data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };
    fetchClientes();
  }, []);
  switch (tipo) {
    case "PENDIENTE":
      filteredClientes = clientes.filter((cliente) =>
        "PENDIENTE" ? cliente.estatus === "PENDIENTE" : true
      );
      break;
    case "PROCESO":
      filteredClientes = clientes.filter(
        (cliente) =>
          cliente.estatus === "EN REVISIÓN DE DOCUMENTOS" || cliente.estatus === "EN PROCESO" || cliente.estatus === "EN REVISIÓN DE PREVIAS"
      );
      break;
    case "BC":
      filteredClientes = clientes.filter((cliente) =>
        "BC" ? cliente.tipo_proceso === "BC" : true
      );
      break;
    default:
      filteredClientes = [];
  }

  return (
    <div>
      <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Folio
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Movimiento
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Afianzadora
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Estatus
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Responsable
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.map((cliente) => (
                <tr
                  key={cliente.id_tramite}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(`/vistaprevia`, {
                      state: { id: cliente.id_tramite },
                    })
                  }
                >
                  <td className="px-4 py-3 font-medium text-gray-900 text-nowrap">
                    {cliente.folio}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{cliente.nombre}</td>

                  <td className="px-4 py-3 text-gray-600">{cliente.fecha}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {cliente.movimiento}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {cliente.afianzadora}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-nowrap text-center">
                    <span
                      className={
                        statusStyles[cliente.estatus] ||
                        "bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-base font-semibold"
                      }
                    >
                      {cliente.estatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-center text-nowrap">
                    {cliente.estatus === "TERMINADO" &&
                    cliente.tiene_compromiso === "SI"
                      ? cliente.categoria_compromiso
                      : cliente.estatus === "TERMINADO" &&
                        cliente.tiene_compromiso === "NO"
                      ? null
                      : cliente.tipo_proceso}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
