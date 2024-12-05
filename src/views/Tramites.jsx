import React from "react";
import { useEffect, useState } from "react";
function Tramites() {
  const [clientes, setClientes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

    fetchClientes();
  }, []);
  //Filtramos la busqueda del input
  const filteredClientes = clientes.filter(
    (cliente) =>
      // Verificamos que cliente.nombre_cli no sea undefined o null antes de intentar usar toLowerCase()
      cliente.nombre &&
      cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase())
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
        <button className="ml-auto mr-10 border border-secondary rounded-[19px] p-3 bg-secondary/25 hover:bg-primary hover:text-white">
          Nuevo tramite
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full mt-5 border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Folio</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Movimiento</th>
              <th className="border p-2">Afianzadora</th>
              <th className="border p-2">Agente</th>
              <th className="border p-2">Beneficiario</th>
              <th className="border p-2">Estatus</th>
              <th className="border p-2">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((cliente) => (
              <tr key={cliente.id_tramite}>
                <td className="border p-2">{cliente.folio}</td>
                <td className="border p-2">{cliente.nombre}</td>
                <td className="border p-2">{cliente.fecha}</td>
                <td className="border p-2">{cliente.movimiento}</td>
                <td className="border p-2">{cliente.afianzadora}</td>
                <td className="border p-2">{cliente.agente}</td>
                <td className="border p-2">{cliente.beneficiario}</td>
                <td className="border p-2">{cliente.estatus}</td>
                <td className="border p-2">{cliente.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tramites;
