import React from "react";
import { useEffect, useState } from "react";
import FormularioTramite from "../components/FormularioTramite";
import { movimientos, estatus } from "../components/Constans";
import { FaSearch } from "react-icons/fa";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Tramites() {
  const [clientes, setClientes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [movimientoFiltro, setMovimientoFiltro] = useState("");
  const [estatusFiltro, setEstatusFiltro] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [folio, setFolio] = useState("");
  const navigate = useNavigate();
  const apiUrl = "https://bitacorabc.site/backend/";
  // Consulta los clientes en el Backend
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch(
          "https://bitacorabc.site/backend/tramites.php"
        );
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    // Llamar a la función para obtener los datos al cargar el componente
    fetchClientes();

    // Configurar el polling para actualizar cada 5 segundos
    const interval = setInterval(() => {
      fetchClientes();
    }, 5000); // 5000 ms = 5 segundos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []); // Solo se ejecuta una vez al montar el componente

  const buscarFolio = async (folio) => {
    try {
      // Realizar la solicitud GET con el folio como parámetro en la URL
      const response = await fetch(`${apiUrl}tramites.php?folio=${folio}`);

      // Verificar si la respuesta es exitosa
      if (response.ok) {
        const data = await response.json();
        if (data.success !== false) {
          console.log("Trámite encontrado:", data);
          navigate("/tramitecliente", {
            state: { id: data.id_tramite },
          });
        } else {
          console.log("Trámite no encontrado.");
          // Aquí puedes mostrar un mensaje de error si no se encuentra el trámite
        }
      } else {
        console.error("Error en la solicitud:", response.status);
        // Maneja el error si la solicitud falla
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      // Maneja el error de la red o el servidor
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
          <input
            id="user"
            type="text"
            placeholder="Folio"
            value={folio}
            onChange={(e) => setFolio(e.target.value)}
            className="border-secondary text-black input px-[10px] text-lg bg-white border-2 rounded-[19px] w-[120px] ml-10 mx-2 focus:outline-none placeholder:text-black/70"
          />
          <button onClick={() => buscarFolio(folio)}>
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
          <select
            value={movimientoFiltro}
            onChange={(e) => setMovimientoFiltro(e.target.value)}
            className="border-secondary text-black input px-[10px] text-lg bg-white border-2 rounded-[19px] w-[250px] mx-2 focus:outline-none"
          >
            <option value="">Todos los movimientos</option>
            {movimientos.map((movimiento) => (
              <option key={movimiento.value} value={movimiento.value}>
                {movimiento.label}
              </option>
            ))}
          </select>

          {/* Filtro por estatus */}
          <select
            value={estatusFiltro}
            onChange={(e) => setEstatusFiltro(e.target.value)}
            className="border-secondary text-black input px-[10px] text-lg bg-white border-2 rounded-[19px] w-[250px] mx-2 focus:outline-none"
          >
            <option value="">Todos los estatus</option>
            {estatus.map((estatusOption) => (
              <option key={estatusOption.value} value={estatusOption.value}>
                {estatusOption.label}
              </option>
            ))}
          </select>
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
                <tr key={cliente.id_tramite}>
                  <td className="border-2 border-secondary p-2">
                    {cliente.folio}
                  </td>
                  <td className="border-2 border-secondary p-2">
                    <Link
                      to="/tramitecliente"
                      state={{ id: cliente.id_tramite }}
                    >
                      {cliente.nombre}
                    </Link>
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
                  <td className="border-2 border-secondary p-2">
                    {cliente.estatus}
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
    </div>
  );
}

export default Tramites;
