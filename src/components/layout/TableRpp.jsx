import React, { useEffect, useState } from "react";
import { obtenerTramites } from "@/services/rpp";
import { FaFileDownload } from "react-icons/fa";
import { IconContext } from "react-icons";
import { AsignarAgente } from "../forms/AsignarAgente";
import { Toaster } from "sonner";
export default function TableRpp() {
  const [tramites, setTramites] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  useEffect(() => {
    // Solicitar opciones al backend
    const fetchTramites = async () => {
      try {
        const response = await obtenerTramites();
        setTramites(response);
      } catch (error) {
        console.error("Error al obtener las opciones:", error);
      }
    };

    fetchTramites();
  }, []);
  const [selected, setSelected] = useState([]);

  // Manejar selección de un solo checkbox
  const handleCheckboxChange = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Seleccionar/deseleccionar todos
  const handleSelectAll = () => {
    if (selected.length === tramites.length) {
      setSelected([]);
    } else {
      setSelected(tramites.map((tramite) => tramite.id));
    }
  };

  const statusStyles = {
    "EN PROCESO":
      "bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-base font-semibold whitespace-nowrap",
    TERMINADO:
      "bg-green-100 text-green-600 px-3 py-1 rounded-full text-base font-semibold",
    ERROR:
      "bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-base font-semibold",
  };
  return (
    <div className="overflow-x-auto w-full p-5">
      <table className="w-full border-collapse text-left">
        <thead className="bg-primary text-white text-sm">
          <tr>
            <th className="p-4 w-10">
              <div className="dark:bg-black/10">
                <label className="text-white">
                  <input
                    className="dark:border-white-400/20 dark:scale-100 transition-all duration-500 ease-in-out dark:hover:scale-110 dark:checked:scale-100 w-5 h-5 cursor-pointer"
                    type="checkbox"
                    checked={selected.length === tramites.length}
                    onChange={handleSelectAll}
                  />
                </label>
              </div>
            </th>
            <th className="p-4 font-semibold">FECHA</th>
            <th className="p-4 font-semibold">FOLIO</th>
            <th className="p-4 font-semibold">AFIANZADORA</th>
            <th className="p-4 font-semibold">TRÁMITE</th>
            <th className="p-4 font-semibold">PROPIETARIO/EMPRESA</th>
            <th className="p-4 font-semibold">DIRECCIÓN</th>
            <th className="p-4 font-semibold">ESTATUS</th>
            <th className="p-4 font-semibold">COSTO</th>
            <th className="p-4 font-semibold">AGENTE</th>
            <th className="p-4 font-semibold">OBSERVACIONES</th>
            <th className="p-4 font-semibold text-right">ARCHIVO</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tramites.length > 0 ? (
            tramites.map((tramite) => (
              <tr key={tramite.id} className="hover:bg-gray-50">
                <td className="p-4 w-10">
                  <div className="dark:bg-black/10">
                    <label className="text-white">
                      <input
                        className="dark:border-white-400/20 dark:scale-100 transition-all duration-500 ease-in-out dark:hover:scale-110 dark:checked:scale-100 w-5 h-5 cursor-pointer"
                        type="checkbox"
                        checked={selected.includes(tramite.id)}
                        onChange={() => handleCheckboxChange(tramite.id)}
                      />
                    </label>
                  </div>
                </td>
                <td className="p-4">{tramite.fecha_solicitud}</td>
                <td className="p-4">{tramite.folio_re}</td>
                <td className="p-4">{tramite.afianzadora}</td>
                <td className="p-4">{tramite.tramite_solicitado}</td>
                <td className="p-4">{tramite.nombre_propietario_empresa}</td>
                <td className="p-4">
                  {tramite.direccion_bi}, {tramite.distrito_ciudad}
                </td>
                <td className="p-4 w-50">
                  <span
                    className={
                      statusStyles[tramite.estatus] ||
                      "bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-base font-semibold"
                    }
                  >
                    {tramite.estatus}
                  </span>
                </td>
                <td className="p-4 text-green-500 font-semibold text-nowrap">
                  ${tramite.costo_tramite} MXN
                </td>
                <td className="p-4">{tramite.agente}</td>
                <td className="p-4">{tramite.observaciones}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() =>
                      window.open(
                        `https://bitacorabc.site/Backend_RPP/uploads/${tramite.url_archivo}`,
                        "_blank"
                      )
                    }
                  >
                    <IconContext.Provider
                      value={{
                        color: "#076163",
                        className: "global-class-name",
                        size: "1.5em",
                      }}
                    >
                      <FaFileDownload />
                    </IconContext.Provider>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="p-4 text-center text-gray-600">
                No se encontraron trámites.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {selected.length > 0 && (
        <button className="fixed bottom-5 right-5 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:opacity-80" onClick={() => {setShowDialog(true)}}>
          Asignar ({selected.length})
        </button>
      )}
      {showDialog && <AsignarAgente onClose={() => setShowDialog(false)} id_tramite={selected}/>}
      <Toaster position="top-center" richColors />
    </div>
  );
}
