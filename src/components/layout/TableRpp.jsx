import React, { useEffect, useState } from "react";
import { obtenerTramites } from "@/services/rpp";
import { FaFileDownload } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { IconContext } from "react-icons";
import { AsignarAgente } from "../forms/AsignarAgente";
import AprobarTramite from "../forms/AprobarTramite";
import { statusStyles, estatusRPP } from "@/utils/Constans";
import { Toaster } from "sonner";
import { MdEdit } from "react-icons/md";
import EnviarFactura from "../forms/EnviarFactura";
import { FiChevronDown } from "react-icons/fi";
import AjustarPrecio from "../forms/AjustarPrecio";
export default function TableRpp() {
  const [tramites, setTramites] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogAprobar, setShowDialogAprobar] = useState(false);
  const [showDialogFactura, setShowDialogFactura] = useState(false);
  const [enableInput, setEnableInput] = useState(false);
  const [precio, setPrecio] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [movimientoFiltro, setMovimientoFiltro] = useState("");
  const [idTramite, setID] = useState(false);
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
  const handleCheckboxChange = (id, estatus, costo) => {
    setSelected((prev) => {
      const exists = prev.some((item) => item.id === id);
      return exists
        ? prev.filter((item) => item.id !== id) // Elimina si ya existe
        : [...prev, { id, estatus, costo }]; // Agrega el nuevo objeto
    });
  };

  const filteredClientes = tramites
    .filter((dato) => {
      if (!dato.folio_re) return true;
      return dato.folio_re.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .filter((cliente) =>
      // Filtramos por "movimiento" y "estatus"
      movimientoFiltro ? cliente.estatus === movimientoFiltro : true
    );
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-6 gap-5 pb-5">
        <div className="relative">
          <input
            id="user"
            type="text"
            placeholder="Folio"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500">
            <IconContext.Provider
              value={{
                color: "#076163",
                className: "global-class-name",
              }}
            >
              <FaSearch />
            </IconContext.Provider>
          </div>
        </div>
        <div className=" relative">
          <select
            value={movimientoFiltro}
            onChange={(e) => setMovimientoFiltro(e.target.value)}
            className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
          >
            <option value="">Estatus</option>
            {estatusRPP.map((movimiento) => (
              <option key={movimiento.value} value={movimiento.value}>
                {movimiento.value}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-gray-500" />
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 w-10">
                  <div className="dark:bg-black/10">
                    <label className="text-white"></label>
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  FECHA
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  FOLIO
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  AFIANZADORA
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  TRÁMITE
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  PROPIETARIO/EMPRESA
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  DIRECCIÓN
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  ESTATUS
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  COSTO
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  AGENTE
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  OBSERVACIONES
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  ARCHIVO
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  CERTIFICADO
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  COMP. PAGO
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.length > 0 ? (
                filteredClientes.map((tramite) => (
                  <tr
                    key={tramite.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="p-4 w-10">
                      <div className="dark:bg-black/10">
                        <label className="text-white">
                          <input
                            className="dark:border-white-400/20 dark:scale-100 transition-all duration-500 ease-in-out dark:hover:scale-110 dark:checked:scale-100 w-5 h-5 cursor-pointer"
                            type="checkbox"
                            checked={selected.some(
                              (item) => item.id === tramite.id
                            )}
                            onChange={() =>
                              handleCheckboxChange(
                                tramite.id,
                                tramite.estatus,
                                tramite.costo_tramite
                              )
                            }
                          />
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 text-nowrap">
                      {tramite.fecha_solicitud}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 text-nowrap">
                      {tramite.folio_re}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tramite.afianzadora}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tramite.tramite_solicitado}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tramite.nombre_propietario_empresa}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tramite.direccion_bi}, {tramite.distrito_ciudad}
                    </td>
                    <td className="px-4 py-3 text-nowrap text-center">
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
                      ${tramite.costo_tramite}
                      <button
                        type="submit"
                        className="text-green-500 p-1"
                        onClick={() => {
                          setEnableInput(true);
                          setPrecio(tramite.costo_tramite);
                          setID(tramite.id);
                        }}
                      >
                        <MdEdit />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tramite.agente}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tramite.observaciones}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tramite.url_archivo != "" &&
                      tramite.url_archivo != null ? (
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
                      ) : null}
                    </td>
                    <td className="p-4 text-center">
                      {tramite.url_certificado !== "" &&
                      tramite.url_certificado !== null ? (
                        <button
                          onClick={() =>
                            window.open(
                              `https://bitacorabc.site/Backend_RPP/uploads/${tramite.url_certificado}`,
                              "_blank"
                            )
                          }
                          className="cursor-pointer"
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
                      ) : null}
                    </td>
                    <td className="p-4 text-center">
                      {tramite.estatus === "FINALIZADO" ? (
                        <button
                          onClick={() =>
                            window.open(
                              `https://bitacorabc.site/Backend_RPP/uploads/${tramite.url_pago}`,
                              "_blank"
                            )
                          }
                          className="cursor-pointer"
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
                      ) : null}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="p-4 text-center text-gray-600">
                    No se encontraron trámites.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {selected.length > 0 && (
          <div className="flex">
            {selected.every((item) => item.estatus === "APROBADO") && (
              <button
                className="fixed bottom-5 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:opacity-80"
                onClick={() => {
                  setShowDialogFactura(true);
                }}
              >
                Enviar factura ({selected.length})
              </button>
            )}
            {selected.every((item) => item.estatus === "NUEVO") && (
              <button
                className="fixed bottom-5 right-5 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:opacity-80"
                onClick={() => {
                  setShowDialog(true);
                }}
              >
                Asignar ({selected.length})
              </button>
            )}
            {selected.every((item) => item.estatus === "EN REVISION") && (
              <button
                className="fixed bottom-5 right-40 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:opacity-80"
                onClick={() => {
                  setShowDialogAprobar(true);
                }}
              >
                Enviar ({selected.length})
              </button>
            )}
            {selected.every((item) => item) && (
              <button
                className="fixed bottom-5 right-96 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:opacity-80"
                onClick={() => {
                  setEnableInput(true);
                }}
              >
                Ajustar costo ({selected.length})
              </button>
            )}
          </div>
        )}
        {showDialog && (
          <AsignarAgente
            onClose={() => setShowDialog(false)}
            id_tramite={selected.map((item) => item.id)}
          />
        )}
        {showDialogAprobar && (
          <AprobarTramite
            onClose={() => setShowDialogAprobar(false)}
            id_tramite={selected.map((item) => item.id)}
          />
        )}
        {showDialogFactura && (
          <EnviarFactura
            onClose={() => setShowDialogFactura(false)}
            id_tramite={selected.map((item) => item.id)}
            costo={selected.map((item) => item.costo)}
          />
        )}
        {enableInput && (
          <AjustarPrecio
            onClose={() => setEnableInput(false)}
            id_tramite={selected.map((item) => item.id)}
          />
        )}
        <Toaster position="top-center" richColors />
      </div>
    </div>
  );
}
