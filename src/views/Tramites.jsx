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
function Tramites() {
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

  return (
    <div className="p-5">
      <div className="flex flex-col">
        <div className="flex w-full">
          <h1 className="text-[36px] text-primary">Trámites</h1>
          <form onSubmit={(e) => buscarFolio(e, folio)} className="flex w-full">
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
        <div className="flex mt-5">
          <input
            id="user"
            type="text"
            placeholder="Nombre del fiado"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-secondary text-black input px-[10px] text-lg bg-white border-2 rounded-[19px] w-[250x] mx-20 focus:outline-none placeholder:text-black/70"
          />
          {/* Filtro por movimiento */}
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

          {/* Filtro por estatus */}
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
      <div className=" bg-white mt-5 border rounded-3xl flex flex-col justify-center items-center">
        <p className="text-secondary font-bold text-2xl pt-5">
          TABLA DE TRAMITES
        </p>
        <div className="overflow-x-auto flex items-center justify-center py-5 w-full px-6">
          <table className="w-full border-collapse bg-white border-x-2 border-secondary text-center">
            <thead>
              <tr className="text-primary">
                <th className="border-b-2 border-r-2 border-secondary p-2">
                  Folio
                </th>
                <th className="border-b-2 border-r-2 border-secondary p-2">
                  Nombre
                </th>
                <th className="border-b-2 border-r-2 border-secondary p-2">
                  Fecha
                </th>
                <th className="border-b-2 border-r-2 border-secondary p-2">
                  Movimiento
                </th>
                <th className="border-b-2 border-r-2 border-secondary p-2">
                  Afianzadora
                </th>
                <th className="border-b-2 border-r-2 border-secondary p-2">
                  Estatus
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.map((cliente) => (
                <tr
                  key={cliente.id_tramite}
                  className="hover:bg-secondary hover:cursor-pointer "
                  onClick={() =>
                    navigate(`/vistaprevia`, {
                      state: { id: cliente.id_tramite },
                    })
                  }
                >
                  <td className="border-2 border-secondary p-2">
                    {cliente.folio}
                  </td>
                  <td className="border-2 border-secondary p-2">
                    {cliente.nombre}
                  </td>

                  <td className="border-2 border-secondary p-2">
                    {cliente.fecha}
                  </td>
                  <td className="border-2 border-secondary p-2">
                    {cliente.movimiento}
                  </td>
                  <td className="border-2 border-secondary p-2">
                    {cliente.afianzadora}
                  </td>
                  {cliente.estatus === "TERMINADO" ? (
                    <td className="border-2 text-[#2E7D32] border-secondary p-2 bg-[#DFFFE2]">
                      {cliente.estatus}
                    </td>
                  ) : cliente.estatus === "EN PROCESO" ? (
                    <td className="border-2 text-[#F57F17] border-secondary p-2 bg-[#FFF9C4]">
                      {cliente.estatus}
                    </td>
                  ) : cliente.estatus === "EN REVISIÓN DE DOCUMENTOS" ? (
                    <td className="border-2 text-[#2196F3] border-secondary p-2 bg-[#E3F2FD]">
                      {cliente.estatus}
                    </td>
                  ) : cliente.estatus === "EN REVISIÓN DE PREVIAS" ? (
                    <td className="border-2 text-[#64B5F6] border-secondary p-2 bg-[#BBDEFB]">
                      {cliente.estatus}
                    </td>
                  ) : cliente.estatus === "NO PROCEDE" ? (
                    <td className="border-2 text-[#C62828] border-secondary p-2 bg-[#FFCDD2]">
                      {cliente.estatus}
                    </td>
                  ) : cliente.estatus === "PENDIENTE" ? (
                    <td className="border-2 text-[#9E9E9E] border-secondary p-2 bg-[#F5F5F5]">
                      {cliente.estatus}
                    </td>
                  ) : (
                    <td className="border-2 text-[#000000] border-secondary p-2 bg-[#E0E0E0]">
                      {cliente.estatus}
                    </td>
                  )}
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

export default Tramites;
