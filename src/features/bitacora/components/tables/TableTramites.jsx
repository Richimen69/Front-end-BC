import React from "react";
import { useEffect, useState } from "react";
import FormularioTramite from "@/features/bitacora/components/forms/FormularioTramite";
import { movimientos, estatus, statusStyles } from "@/shared/utils/Constans";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { fetchTramites } from "@/features/bitacora/services/tramitesClientes";

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
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [estatusDisponibles, setEstatusDisponibles] = useState([]);
  const [movimientosDisponibles, setMovimientosDisponibles] = useState([]);
  const [ordenarPorPago, setOrdenarPorPago] = useState(false);
  const prioridadPago = {
    PENDIENTE: 1,
    "NO PAGADA": 2,
  };
  const manejarOrdenPago = () => {
    setOrdenarPorPago(!ordenarPorPago);
  };

  // Consulta los clientes en el Backend
  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
    localStorage.setItem("searchQueryFianza", searchQueryFianza);
    localStorage.setItem("movimientoFiltro", movimientoFiltro);
    localStorage.setItem("estatusFiltro", estatusFiltro);
  }, [searchQuery, searchQueryFianza, movimientoFiltro, estatusFiltro]);
  const manejarOrdenamiento = (columna) => {
    setOrdenamiento((prev) => ({
      columna,
      direccion:
        prev.columna === columna && prev.direccion === "asc" ? "desc" : "asc",
    }));
  };
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await fetchTramites();
        setClientes(data);

        // Extraer estatus únicos desde los datos recibidos
        const estatusUnicos = [...new Set(data.map((item) => item.estatus))];

        // Filtrar los estatus disponibles con base en los presentes en los datos
        const estatusFiltrados = estatus.filter((op) =>
          estatusUnicos.includes(op.value)
        );
        setEstatusDisponibles(estatusFiltrados);
        // Extraer movimientos únicos desde los datos recibidos
        const movimientosUnicos = [
          ...new Set(data.map((item) => item.movimiento)),
        ];

        // Filtrar los movimientos disponibles con base en los presentes en los datos
        const movimientosFiltrados = movimientos.filter((op) =>
          movimientosUnicos.includes(op.value)
        );

        setMovimientosDisponibles(movimientosFiltrados);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    fetchClientes();

    const interval = setInterval(() => {
      fetchClientes();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Filtro por Fianza */}
          <div>
            <input
              type="text"
              placeholder="Fianza"
              value={searchQueryFianza}
              onChange={(e) => setSearchQueryFianza(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filtro por nombre del fiado */}
          <div>
            <input
              type="text"
              placeholder="Nombre del fiado"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Select movimiento */}
          <div className="relative">
            <select
              value={movimientoFiltro}
              onChange={(e) => setMovimientoFiltro(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="">Todos los movimientos</option>
              {movimientosDisponibles.map((movimiento) => (
                <option key={movimiento.value} value={movimiento.value}>
                  {movimiento.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-gray-500" />
          </div>

          {/* Estatus + botón nuevo trámite */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-auto flex-1">
              <select
                value={estatusFiltro}
                onChange={(e) => setEstatusFiltro(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="">Todos los estatus</option>
                {estatusDisponibles.map((estatusOption) => (
                  <option key={estatusOption.value} value={estatusOption.value}>
                    {estatusOption.label}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>

            <button
              className="h-10 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-green-700 focus:outline-hidden focus:ring-2 focus:ring-green-500 whitespace-nowrap"
              onClick={() => setIsFormVisible(true)}
            >
              Nuevo trámite
            </button>
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
                <th
                  onClick={manejarOrdenPago}
                  className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer"
                >
                  Pago {ordenarPorPago && <span>🔽</span>}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.map((cliente) => {
                // Convertir "DD/MM/YYYY" a objeto Date
                const [day, month, year] = cliente.fecha.split("/");
                const fechaCliente = new Date(`${year}-${month}-${day}`);
                const hoy = new Date();

                // Calcular diferencia de días
                const diferenciaDias = Math.floor(
                  (hoy - fechaCliente) / (1000 * 60 * 60 * 24)
                );

                // Determinar clase de color

                const colorFecha =
                  cliente.estatus === "EN REVISIÓN DE PREVIAS" &&
                  diferenciaDias > 15
                    ? "text-red-600 bg-red-100 rounded-lg"
                    : "text-gray-600";

                return (
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
                    <td className="px-4 py-3 text-gray-600">
                      {cliente.nombre}
                    </td>

                    {/* Aquí aplicas la clase dinámica */}
                    <td className={`px-4 py-3`}>
                      <p className={`p-1 ${colorFecha} text-center`}>
                        {cliente.fecha}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {cliente.movimiento}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {cliente.afianzadora}
                    </td>
                    <td className="relative px-4 py-3 text-gray-600 text-nowrap text-center group">
                      <span
                        className={
                          statusStyles[cliente.estatus] ||
                          "bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-base font-semibold"
                        }
                      >
                        {cliente.estatus}
                      </span>

                      {/* Tooltip */}
                      {cliente.estatus !== "TERMINADO" &&
                        cliente.ultimo_movimiento !== null &&
                        cliente.ultimo_movimiento !== "" && (
                          <div className="absolute z-10 hidden group-hover:block bg-primary text-white text-xs rounded py-1 px-2 bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-normal w-96 text-center">
                            {cliente.ultimo_movimiento}
                          </div>
                        )}
                    </td>

                    <td className="px-4 py-3 text-gray-600 text-center text-nowrap">
                      {cliente.estatus === "TERMINADO/COMPROMISO" &&
                      cliente.tiene_compromiso === "SI"
                        ? cliente.categoria_compromiso
                        : cliente.estatus === "TERMINADO" ||
                          (cliente.estatus === "TERMINADO/PENDIENTE" &&
                            cliente.tiene_compromiso === "NO")
                        ? null
                        : cliente.tipo_proceso}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {cliente.estatus_pago}
                    </td>
                  </tr>
                );
              })}
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
