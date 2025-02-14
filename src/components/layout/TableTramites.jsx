import React from "react";
import { useEffect, useState } from "react";
import FormularioTramite from "@/components/forms/FormularioTramite";
import { movimientos, estatus } from "@/utils/Constans";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [movimientoFiltro, setMovimientoFiltro] = useState("");
  const [estatusFiltro, setEstatusFiltro] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [folio, setFolio] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Consulta los clientes en el Backend
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
    .filter(
      (cliente) =>
        // Filtramos por "movimiento" y "estatus"
        (movimientoFiltro ? cliente.movimiento === movimientoFiltro : true) &&
        (estatusFiltro ? cliente.estatus === estatusFiltro : true)
    );

  const statusStyles = {
    TERMINADO:
      "bg-[#DFFFE2] text-[#2E7D32] px-3 py-1 rounded-full font-semibold",
    "EN PROCESO":
      "bg-[#FFF9C4] text-[#F57F17] px-3 py-1 rounded-full font-semibold",
    "EN REVISIÓN DE DOCUMENTOS":
      "bg-[#E3F2FD] text-[#2196F3] px-3 py-1 rounded-full font-semibold",
    "EN REVISIÓN DE PREVIAS":
      "bg-[#BBDEFB] text-[#64B5F6] px-3 py-1 rounded-full font-semibold",
    "NO PROCEDE":
      "bg-[#FFCDD2] text-[#C62828] px-3 py-1 rounded-full font-semibold",
    PENDIENTE:
      "bg-[#F5F5F5] text-[#9E9E9E] px-3 py-1 rounded-full font-semibold",
    default: "bg-[#E0E0E0] text-[#000000] px-3 py-1 rounded-full font-semibold",
  };

  return (
    <div className="w-full p-5">
      <div className="flex flex-col">
        <div className="flex mt-5">
          <div className="flex">
            <form
              onSubmit={(e) => buscarFolio(e, folio)}
              className="flex w-full"
            >
              <input
                id="user"
                type="text"
                placeholder="Folio"
                value={folio}
                onChange={(e) => setFolio(e.target.value)}
                className="border-secondary text-black input px-[10px] text-lg bg-white border-2 rounded-[19px] w-[120px] ml-10 mx-2 focus:outline-none placeholder:text-black/70"
              />
              <button type="submit">
                <IconContext.Provider
                  value={{
                    color: "#076163",
                    className: "global-class-name",
                    size: "1.5em",
                  }}
                >
                  <FaSearch />
                </IconContext.Provider>
              </button>
            </form>
          </div>
          <input
            id="user"
            type="text"
            placeholder="Nombre del fiado"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-secondary text-black input px-[10px] text-lg bg-white border-2 rounded-[19px] w-[250x] mx-20 focus:outline-none placeholder:text-black/70"
          />
          <div className="relative w-[250px] mx-2 flex">
            <select
              value={movimientoFiltro}
              onChange={(e) => setMovimientoFiltro(e.target.value)}
              className="border-secondary text-black input px-[10px] text-lg bg-white border-2 rounded-[19px] w-full focus:outline-none appearance-none hover:cursor-pointer hover:border-primary"
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

          <div className="relative w-[250px] mx-2 flex">
            <select
              value={estatusFiltro}
              onChange={(e) => setEstatusFiltro(e.target.value)}
              className="border-secondary text-black input px-[10px] text-lg bg-white border-2 rounded-[19px] w-full focus:outline-none appearance-none hover:cursor-pointer hover:border-primary"
            >
              <option value="">Todos los estatus</option>
              {estatus.map((estatusOption) => (
                <option key={estatusOption.value} value={estatusOption.value}>
                  {estatusOption.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-gray-500" />
          </div>
          <button
            className="ml-auto mr-10 border border-secondary rounded-[19px] p-3 bg-white hover:bg-primary hover:text-white"
            onClick={() => setIsFormVisible(true)}
          >
            Nuevo tramite
          </button>
        </div>
      </div>
      <h1 className="text-[36px] text-primary">Trámites</h1>
      <div className="overflow-x-auto w-full p-5">
        <table className="w-full border-collapse text-center">
          <thead className="bg-primary text-white text-sm">
            <tr >
              <th className="p-4 font-semibold">
                Folio
              </th>
              <th className="p-4 font-semibold">
                Nombre
              </th>
              <th className="p-4 font-semibold">
                Fecha
              </th>
              <th className="p-4 font-semibold">
                Movimiento
              </th>
              <th className="p-4 font-semibold">
                Afianzadora
              </th>
              <th className="p-4 font-semibold">
                Estatus
              </th>
              <th className="p-4 font-semibold">
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClientes.map((cliente) => (
              <tr
                key={cliente.id_tramite}
                className="hover:bg-gray-100 hover:cursor-pointer text-center"
                onClick={() =>
                  navigate(`/vistaprevia`, {
                    state: { id: cliente.id_tramite },
                  })
                }
              >
                <td className="p-4">
                  {cliente.folio}
                </td>
                <td className="p-4">
                  {cliente.nombre}
                </td>

                <td className="p-4">
                  {cliente.fecha}
                </td>
                <td className="p-4">
                  {cliente.movimiento}
                </td>
                <td className="p-4">
                  {cliente.afianzadora}
                </td>
                <td className="p-4">
                  <span
                    className={
                      statusStyles[cliente.estatus] ||
                      "bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-base font-semibold"
                    }
                  >
                    {cliente.estatus}
                  </span>
                </td>
                <td className="p-4">
                  {cliente.tipo_proceso}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <FormularioTramite
        isVisible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
      />
      <Toaster position="top-center" richColors />
    </div>
  );
}
