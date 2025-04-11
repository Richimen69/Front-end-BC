import React from "react";
import { useEffect, useState } from "react";
import FormularioTramite from "@/components/forms/FormularioTramite";
import { movimientos, estatus, statusStyles } from "@/utils/Constans";
import { FaSearch } from "react-icons/fa";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import {
  buscarTramitePorFolio,
  fetchTramites,
} from "@/services/tramitesClientes";
export default function TableTramites() {
  const [clientes, setClientes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(
    localStorage.getItem("searchQuery") || ""
  );
  const [searchQueryFianza, setSearchQueryFianza] = useState(
    localStorage.getItem("searchQueryFianza") || ""
  );
  const [movimientoFiltro, setMovimientoFiltro] = useState(
    localStorage.getItem("movimientoFiltro") || ""
  );
  const [estatusFiltro, setEstatusFiltro] = useState(
    localStorage.getItem("estatusFiltro") || ""
  );
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [folio, setFolio] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Consulta los clientes en el Backend
  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
    localStorage.setItem("searchQueryFianza", searchQueryFianza);
    localStorage.setItem("movimientoFiltro", movimientoFiltro);
    localStorage.setItem("estatusFiltro", estatusFiltro);
  }, [searchQuery, searchQueryFianza, movimientoFiltro, estatusFiltro]);

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

    // Configurar el polling para actualizar cada 5 segundos
    const interval = setInterval(() => {
      fetchClientes();
    }, 5000); // 5000 ms = 5 segundos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []); // Solo se ejecuta una vez al montar el componente

  const buscarFolio = async (e, folio) => {
    e.preventDefault();
    try {
      const data = await buscarTramitePorFolio(folio);
      if (data.success !== false) {
        console.log("Trámite encontrado:", data);
        navigate("/vistaprevia", { state: { id: data.id_tramite } });
      } else {
        console.log("Trámite no encontrado.");
        setError("No se encontró un trámite con ese folio.");
        toast.error(error);
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      setError(error.message); // Muestra el mensaje del error capturado
    }
  };

  // Filtramos la búsqueda del input
  const filteredClientes = clientes
    .filter(
      (cliente) =>
        cliente.nombre &&
        cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((cliente) => {
      if (!searchQueryFianza.trim()) return true; // Si la búsqueda está vacía, mostrar todo

      return (
        cliente.fianza &&
        cliente.fianza.toLowerCase().includes(searchQueryFianza.toLowerCase())
      );
    })

    .filter(
      (cliente) =>
        // Filtramos por "movimiento" y "estatus"
        (movimientoFiltro ? cliente.movimiento === movimientoFiltro : true) &&
        (estatusFiltro ? cliente.estatus === estatusFiltro : true)
    );

  return (
    <div className="w-full p-5 ">
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Trámites
        </h1>
        <div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mr-5">
            <div className="lg:col-span-1">
              <input
                id="user"
                type="text"
                placeholder="Fianza"
                value={searchQueryFianza}
                onChange={(e) => setSearchQueryFianza(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="lg:col-span-1">
              <input
                id="user"
                type="text"
                placeholder="Nombre del fiado"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="relative">
              <select
                value={movimientoFiltro}
                onChange={(e) => setMovimientoFiltro(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="">Todos los movimientos</option>
                {movimientos.map((movimiento) => (
                  <option key={movimiento.value} value={movimiento.value}>
                    {movimiento.label}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={estatusFiltro}
                  onChange={(e) => setEstatusFiltro(e.target.value)}
                  className="flex-1 h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                >
                  <option value="">Todos los estatus</option>
                  {estatus.map((estatusOption) => (
                    <option
                      key={estatusOption.value}
                      value={estatusOption.value}
                    >
                      {estatusOption.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-gray-500" />
              </div>
              <button
                className="h-10 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-nowrap"
                onClick={() => setIsFormVisible(true)}
              >
                Nuevo tramite
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 overflow-hidden mt-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Folio
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Fianza
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
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Pago
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
                  <td className="px-4 py-3 font-medium text-gray-900 text-nowrap">
                    {cliente.fianza}
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
                  <td className="px-4 py-3 text-gray-600">
                    {cliente.estatus_pago}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <FormularioTramite
        isVisible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
      />
      <Toaster position="top-center" richColors />
    </div>
  );
}
