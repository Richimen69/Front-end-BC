import React, { useEffect, useState } from "react";
import { obtenerTramites } from "@/services/rpp";
import { FaFileDownload } from "react-icons/fa";
import { IconContext } from "react-icons";
export default function TableRpp() {
  const [tramites, setTramites] = useState([]);
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

  const statusStyles = {
    "EN PROCESO":
      "bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-base font-semibold",
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
            <th className="p-4 font-semibold w-40">FECHA</th>
            <th className="p-4 font-semibold w-40">FOLIO</th>
            <th className="p-4 font-semibold w-40">AFIANZADORA</th>
            <th className="p-4 font-semibold w-[300px]">TRÁMITE</th>
            <th className="p-4 font-semibold w-[300px]">PROPIETARIO/EMPRESA</th>
            <th className="p-4 font-semibold w-[300px]">DIRECCIÓN</th>
            <th className="p-4 font-semibold w-[100px]">ESTATUS</th>
            <th className="p-4 font-semibold w-[200px]">COSTO</th>
            <th className="p-4 font-semibold w-[300px]">OBSERVACIONES</th>
            <th className="p-4 font-semibold w-40 text-right">ARCHIVO</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tramites.length > 0 ? (
            tramites.map((tramite) => (
              <tr key={tramite.id} className="hover:bg-gray-50">
                <td className="p-4 w-40">{tramite.fecha_solicitud}</td>
                <td className="p-4 w-40">{tramite.folio_re}</td>
                <td className="p-4 w-40">{tramite.afianzadora}</td>
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
                <td className="p-4 text-right text-green-500 font-semibold">
                  ${tramite.costo_tramite} MXN
                </td>
                <td className="p-4">{tramite.observaciones}</td>
                <td className="p-4 w-40 text-center">
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
    </div>
  );
}
