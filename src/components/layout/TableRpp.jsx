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
import CancelarTramite from "../forms/CancelarTramite";
import EditarTramite from "../forms/EditarTramite";
import EliminarTramite from "../forms/EliminarTramite";
export default function TableRpp() {
  const [tramites, setTramites] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogAprobar, setShowDialogAprobar] = useState(false);
  const [showDialogFactura, setShowDialogFactura] = useState(false);
  const [showDialogBorrar, setShowDialogBorrar] = useState(false);
  const [showDialogCan, setShowDialogCan] = useState(false);
  const [enableInput, setEnableInput] = useState(false);
  const [editarTramite, setEditarTramite] = useState(false);
  const [precio, setPrecio] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [movimientoFiltro, setMovimientoFiltro] = useState("");
  const [idTramite, setID] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);

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
                <th
                  className="px-4 py-3 text-left font-medium text-gray-600"
                  colSpan={5}
                >
                  DOCUMENTOS
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
                    <td
                      className="px-4 py-3 font-medium text-gray-900 text-nowrap"
                      onClick={() => {
                        setEditarTramite(true);
                        setID(tramite.id);
                      }}
                    >
                      {tramite.folio_re}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tramite.afianzadora}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tramite.tramite_solicitado}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-600"
                      onClick={() => {
                        setEditarTramite(true);
                        setID(tramite.id);
                      }}
                    >
                      {tramite.nombre_propietario_empresa}
                    </td>
                    <td
                      className="px-4 py-3 text-gray-600"
                      onClick={() => {
                        setEditarTramite(true);
                        setID(tramite.id);
                      }}
                    >
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
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tramite.agente}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tramite.observaciones}
                    </td>
                    <td className="text-center relative">
                      <button
                        onClick={() =>
                          window.open(
                            `https://bitacorabc.site/Backend_RPP/uploads/${tramite.url_archivo}`,
                            "_blank"
                          )
                        }
                        className={`p-2 ${
                          tramite.url_archivo
                            ? "text-blue-600 hover:bg-blue-50 cursor cursor-pointer"
                            : "text-gray-400 cursor-not-allowed"
                        } rounded-full`}
                        disabled={!tramite.url_archivo}
                        onMouseEnter={() =>
                          setShowTooltip({
                            id: tramite.id,
                            type: "archivo",
                          })
                        }
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" x2="8" y1="13" y2="13"></line>
                          <line x1="16" x2="8" y1="17" y2="17"></line>
                          <line x1="10" x2="8" y1="9" y2="9"></line>
                        </svg>
                      </button>
                      {showTooltip?.id === tramite.id &&
                        showTooltip?.type === "archivo" && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                            Archivo
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                    </td>
                    <td className="text-center relative">
                      <button
                        onClick={() =>
                          window.open(
                            `https://bitacorabc.site/Backend_RPP/uploads/${tramite.url_certificado}`,
                            "_blank"
                          )
                        }
                        className={`p-2 ${
                          tramite.url_certificado
                            ? "text-green-600 hover:bg-green-50 cursor cursor-pointer"
                            : "text-gray-400 cursor-not-allowed"
                        } rounded-full`}
                        disabled={!tramite.url_certificado}
                        onMouseEnter={() =>
                          setShowTooltip({
                            id: tramite.id,
                            type: "certificado",
                          })
                        }
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" x2="8" y1="13" y2="13"></line>
                          <line x1="16" x2="8" y1="17" y2="17"></line>
                          <line x1="10" x2="8" y1="9" y2="9"></line>
                        </svg>
                      </button>
                      {showTooltip?.id === tramite.id &&
                        showTooltip?.type === "certificado" && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                            Certificado
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                    </td>
                    <td className="text-center relative">
                      <button
                        onClick={() =>
                          window.open(
                            `https://bitacorabc.site/Backend_RPP/uploads/${tramite.url_pago}`,
                            "_blank"
                          )
                        }
                        className={`p-2 ${
                          tramite.url_pago
                            ? "text-amber-600 hover:bg-amber-50 cursor-pointer"
                            : "text-gray-400 cursor-not-allowed"
                        } rounded-full cursor`}
                        disabled={!tramite.url_pago}
                        onMouseEnter={() =>
                          setShowTooltip({
                            id: tramite.id,
                            type: "compPago",
                          })
                        }
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"></path>
                          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                          <path d="M12 17.5v-11"></path>
                        </svg>
                      </button>
                      {showTooltip?.id === tramite.id &&
                        showTooltip?.type === "compPago" && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                            Comprobante de pago
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                    </td>
                    <td className="text-center relative">
                      <button
                        onClick={() =>
                          window.open(
                            `https://bitacorabc.site/Backend_RPP/${tramite.url_factura}`,
                            "_blank"
                          )
                        }
                        disabled={!tramite.url_factura}
                        className={`p-2 ${
                          tramite.url_factura
                            ? "text-purple-600 hover:bg-purple-50 cursor-pointer"
                            : "text-gray-400 cursor-not-allowed"
                        } rounded-full `}
                        onMouseEnter={() =>
                          tramite.id &&
                          setShowTooltip({
                            id: tramite.id,
                            type: "factura",
                          })
                        }
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            width="16"
                            height="20"
                            x="4"
                            y="2"
                            rx="2"
                          ></rect>
                          <path d="M8 10h8"></path>
                          <path d="M8 14h8"></path>
                          <path d="M8 18h5"></path>
                        </svg>
                      </button>
                      {showTooltip?.id === tramite.id &&
                        showTooltip?.type === "factura" && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                            Factura
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                    </td>
                    <td className="text-center relative">
                      <button
                        onClick={() =>
                          window.open(
                            `https://bitacorabc.site/Backend_RPP/uploads/${tramite.url_xml}`,
                            "_blank"
                          )
                        }
                        disabled={!tramite.url_xml}
                        className={`p-2 ${
                          tramite.url_xml
                            ? "text-red-600 hover:bg-red-50 cursor-pointer"
                            : "text-gray-400 cursor-not-allowed"
                        } rounded-full`}
                        onMouseEnter={() =>
                          tramite.id &&
                          setShowTooltip({
                            id: tramite.id,
                            type: "xml",
                          })
                        }
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <path d="M14 2v6h6"></path>
                          <path d="m8 16 2-2-2-2"></path>
                          <path d="m14 12-2 2 2 2"></path>
                        </svg>
                      </button>
                      {showTooltip?.id === tramite.id &&
                        showTooltip?.type === "xml" && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                            XML
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
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
                className="fixed bottom-5 left-96 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:opacity-80"
                onClick={() => {
                  setShowDialogAprobar(true);
                }}
              >
                Enviar ({selected.length})
              </button>
            )}
            {selected.every((item) => item.estatus != "CANCELADO") && (
              <button
                className="fixed bottom-5 right-96 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:opacity-80"
                onClick={() => {
                  setEnableInput(true);
                }}
              >
                Ajustar costo ({selected.length})
              </button>
            )}
            {selected.every((item) => item.estatus != "CANCELADO") && (
              <button
                className="fixed bottom-5 right-40 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:opacity-80"
                onClick={() => {
                  setShowDialogCan(true);
                }}
              >
                Cancelar ({selected.length})
              </button>
            )}
            {selected.every((item) => item) && (
              <button
                className="fixed bottom-5 bg-primary left-56 text-white px-6 py-3 rounded-full shadow-lg hover:opacity-80"
                onClick={() => {
                  setShowDialogBorrar(true);
                }}
              >
                Eliminar ({selected.length})
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
        {showDialogCan && (
          <CancelarTramite
            onClose={() => setShowDialogCan(false)}
            id_tramite={selected.map((item) => item.id)}
          />
        )}
        {enableInput && (
          <AjustarPrecio
            onClose={() => setEnableInput(false)}
            id_tramite={selected.map((item) => item.id)}
          />
        )}
        {editarTramite && (
          <EditarTramite
            onClose={() => setEditarTramite(false)}
            id_tramite={idTramite}
          />
        )}
        {showDialogBorrar && (
          <EliminarTramite
            onClose={() => setShowDialogBorrar(false)}
            id_tramite={selected.map((item) => item.id)}
          />
        )}
        <Toaster position="top-center" richColors />
      </div>
    </div>
  );
}
