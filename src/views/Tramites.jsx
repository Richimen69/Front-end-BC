import React from "react";
import { useEffect, useState } from "react";
import FormularioTramite from "../components/FormularioTramite";
function Tramites() {
  const [clientes, setClientes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [movimientoFiltro, setMovimientoFiltro] = useState("");
  const [estatusFiltro, setEstatusFiltro] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Lista de movimientos y estatus
  const movimientos = [
    { value: "CANCELACIÓN", label: "CANCELACIÓN" },
    { value: "DISMINUCION", label: "DISMINUCION" },
    { value: "SEGUIMIENTO", label: "SEGUIMIENTO" },
    { value: "AUMENTO", label: "AUMENTO" },
    { value: "ANULACIÓN", label: "ANULACIÓN" },
    { value: "ACTUALIZACIÓN", label: "ACTUALIZACIÓN" },
    { value: "EXPEDICIÓN", label: "EXPEDICIÓN" },
    { value: "SEGURO RC", label: "SEGURO RC" },
    {
      value: "CANCELACION Y DEV. DEP PREND.",
      label: "CANCELACION Y DEV. DEP PREND.",
    },
    { value: "CORRECCIÓN", label: "CORRECCIÓN" },
    { value: "PRÓRROGA", label: "PRÓRROGA" },
    { value: "DEV. DEP. PRENDARIO", label: "DEV. DEP. PRENDARIO" },
    { value: "COTIZACIÓN", label: "COTIZACIÓN" },
    { value: "ALTA", label: "ALTA" },
    { value: "ANUENCIA", label: "ANUENCIA" },
    { value: "SEGURO MAQUINARIA", label: "SEGURO MAQUINARIA" },
    { value: "BAJA O.S.", label: "BAJA O.S." },
    { value: "DEV. NOTAS DE CRÉDITO", label: "DEV. NOTAS DE CRÉDITO" },
    { value: "ENDOSO", label: "ENDOSO" },
    {
      value: "ENDOSO POR DIFERIMIENTO DE PLAZO",
      label: "ENDOSO POR DIFERIMIENTO DE PLAZO",
    },
    { value: "CAMBIO DE AGENTE", label: "CAMBIO DE AGENTE" },
    { value: "DEVOLUCION DEP PREND", label: "DEVOLUCION DEP PREND" },
    { value: "CARTA LINEA AFIANZAMIENTO", label: "CARTA LINEA AFIANZAMIENTO" },
    { value: "DEV. DEP. EQUIVOCADO", label: "DEV. DEP. EQUIVOCADO" },
    { value: "CARTA TILDACIÓN", label: "CARTA TILDACIÓN" },
  ];

  const estatus = [
    { value: "En Proceso", label: "En Proceso" },
    { value: "En Revision de previas", label: "En Revision de previas" },
    { value: "No Procede", label: "No Procede" },
    { value: "Pendiente", label: "Pendiente" },
    { value: "Terminado", label: "Terminado" },
  ];

  // Consulta los clientes en el Backend
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch("http://localhost/backend/tramites.php");
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
      <div className="flex">
        <h1 className="text-[36px] text-[#535353]">Trámites</h1>
        <input
          id="user"
          type="text"
          placeholder="Nombre del fiado"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-secondary text-black input px-[10px] text-lg bg-[#F5F6FA] border-2 rounded-[19px] w-[330px] mx-20 focus:outline-none placeholder:text-black/70"
        />
        {/* Filtro por movimiento */}
        <select
          value={movimientoFiltro}
          onChange={(e) => setMovimientoFiltro(e.target.value)}
          className="border-secondary text-black input px-[10px] text-lg bg-[#F5F6FA] border-2 rounded-[19px] w-[250px] mx-2 focus:outline-none"
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
          className="border-secondary text-black input px-[10px] text-lg bg-[#F5F6FA] border-2 rounded-[19px] w-[250px] mx-2 focus:outline-none"
        >
          <option value="">Todos los estatus</option>
          {estatus.map((estatusOption) => (
            <option key={estatusOption.value} value={estatusOption.value}>
              {estatusOption.label}
            </option>
          ))}
        </select>
        <button
          className="ml-auto mr-10 border border-secondary rounded-[19px] p-3 bg-secondary/25 hover:bg-primary hover:text-white"
          onClick={() => setIsFormVisible(true)}
        >
          Nuevo tramite
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full mt-5 border-collapse border-b-2 border-l-2 border-r-2 border-secondary">
          <thead>
            <tr className="text-primary">
              <th className="border-b border-r border-secondary p-2">Folio</th>
              <th className="border-b border-r border-secondary p-2">Nombre</th>
              <th className="border-b border-r border-secondary p-2">Fecha</th>
              <th className="border-b border-r border-secondary p-2">
                Movimiento
              </th>
              <th className="border-b border-r border-secondary p-2">
                Afianzadora
              </th>
              <th className="border-b border-r border-secondary p-2">Agente</th>
              <th className="border-b border-r border-secondary p-2">
                Beneficiario
              </th>
              <th className="border-b border-r border-secondary p-2">
                Estatus
              </th>
              <th className="border-b border-r border-secondary p-2">
                Observaciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((cliente) => (
              <tr key={cliente.id_tramite}>
                <td className="border border-secondary p-2">{cliente.folio}</td>
                <td className="border border-secondary p-2">
                  {cliente.nombre}
                </td>
                <td className="border border-secondary p-2">{cliente.fecha}</td>
                <td className="border border-secondary p-2">
                  {cliente.movimiento}
                </td>
                <td className="border border-secondary p-2">
                  {cliente.afianzadora}
                </td>
                <td className="border border-secondary p-2">
                  {cliente.agente}
                </td>
                <td className="border border-secondary p-2">
                  {cliente.beneficiario}
                </td>
                <td className="border border-secondary p-2">
                  {cliente.estatus}
                </td>
                <td className="border border-secondary p-2">
                  {cliente.observaciones}
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
    </div>
  );
}

export default Tramites;
