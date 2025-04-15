import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { fetchTramites } from "../services/tramitesClientes";
import { buscarMovimiento } from "../services/movimientos";
import { TbEdit } from "react-icons/tb";
import { Toaster, toast } from "sonner";
import CancelarComp from "@/components/forms/bitacora/CancelarComp";
function VistaTramite() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [dias, setDias] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { id } = location.state || {}; // Obtener el id desde el estado

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTramites();
        setClientes(data);

        // Encontrar cliente específico
        const clienteEncontrado = data.find(
          (cliente) => cliente.id_tramite === id
        );
        if (clienteEncontrado) {
          // Obtener movimientos
          const movimientosData = await buscarMovimiento(id);
          if (Array.isArray(movimientosData) && movimientosData.length > 0) {
            setMovimientos(
              movimientosData.map((mov) => ({
                id_movimiento: mov.id_movimiento,
                movimiento: mov.movimiento,
                fecha: mov.fecha,
                nombre: mov.nombre,
                id_tramite: mov.id_tramite,
              }))
            );
          } else {
            setError("No hay observaciones disponibles.");
          }

          // Calcular días de diferencia si el cliente está encontrado
          if (clienteEncontrado?.fecha && clienteEncontrado?.fecha_pago) {
            const calcularDiasDeDiferencia = (fecha1, fecha2) => {
              const convertirAFecha = (fechaStr) => {
                const [dia, mes, anio] = fechaStr.split("/").map(Number);
                // Asegurándonos de que las fechas sean interpretadas correctamente
                const fechaFormateada = `${anio}-${
                  mes < 10 ? "0" + mes : mes
                }-${dia < 10 ? "0" + dia : dia}`;
                return new Date(fechaFormateada);
              };

              // Convertir ambas fechas
              const date1 = convertirAFecha(fecha1);
              const date2 = convertirAFecha(fecha2);

              // Calcular la diferencia en milisegundos
              const diferenciaEnMilisegundos = date2 - date1;

              // Verificar si la fecha es válida
              if (isNaN(diferenciaEnMilisegundos)) {
                console.error("Una de las fechas no es válida.");
                return NaN; // Si alguna fecha es inválida, retornamos NaN
              }
              // Convertir la diferencia a días y redondear hacia abajo
              return Math.floor(
                diferenciaEnMilisegundos / (1000 * 60 * 60 * 24)
              );
            };

            const diasDeDiferencia = calcularDiasDeDiferencia(
              clienteEncontrado.fecha_termino,
              clienteEncontrado.fecha_pago
            );

            if (diasDeDiferencia >= 0) {
              setDias(diasDeDiferencia);
            } else {
              setDias("0");
            }
          }
        }
      } catch (error) {
        setError("Error al obtener los datos.");
      }
    };
    fetchData();
  }, [id]);
  const clienteEncontrado = clientes.find(
    (cliente) => cliente.id_tramite === id
  );
  if (!clienteEncontrado) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-primary animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="w-full bg-white p-5 rounded-xl">
        <div className="space-y-1">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-semibold">
                Fecha de inicio: {clienteEncontrado.fecha}
              </p>
              {clienteEncontrado.estatus === "TERMINADO" ? (
                <p className="text-sm text-muted-foreground">
                  Fecha de Termino: {clienteEncontrado.fecha_termino}
                </p>
              ) : null}
              {clienteEncontrado.movimiento === "SEGURO RC" ? (
                <p className="text-sm text-muted-foreground font-bold">
                  Póliza: {clienteEncontrado.fianza}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground font-bold">
                  Fianza: {clienteEncontrado.fianza}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-semibold">Folio: {clienteEncontrado.folio}</p>
            </div>
          </div>
          <div>
            <hr className="my-5 h-[1px] border-t-0 bg-gray-300" />
          </div>
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Fiado</h3>
                <p>{clienteEncontrado.nombre}</p>
              </div>
              <div className="space-y-2">
                {clienteEncontrado.movimiento === "SEGURO RC" ? (
                  <h3 className="font-semibold text-primary">Aseguradora</h3>
                ) : (
                  <h3 className="font-semibold text-primary">Afianzadora</h3>
                )}
                <p>{clienteEncontrado.afianzadora}</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Beneficiario</h3>
                <p>{clienteEncontrado.beneficiario}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Agente</h3>
                <p>{clienteEncontrado.agente}</p>
              </div>
            </div>
            <div>
              <hr className="my-5 h-[1px] border-t-0 bg-gray-300" />
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Movimiento</h3>
                <p>{clienteEncontrado.movimiento}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Estado</h3>
                <p
                  className={`inline-block px-2 py-1 rounded ${
                    clienteEncontrado.estatus === "TERMINADO"
                      ? "bg-[#2E7D32] text-white"
                      : clienteEncontrado.estatus === "EN PROCESO"
                      ? "bg-[#F57F17] text-white"
                      : clienteEncontrado.estatus === "PENDIENTE"
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-black" // Fondo por defecto si no coincide con ningún caso
                  }`}
                >
                  {clienteEncontrado.estatus}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">.</h3>
                <p>{clienteEncontrado.tipo_proceso}</p>
              </div>
            </div>
            {clienteEncontrado.tiene_compromiso === "SI" ? (
              <div>
                <hr className="my-5 h-[1px] border-t-0 bg-gray-300" />
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">Compromiso</h3>
                    <p>{clienteEncontrado.categoria_compromiso}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">
                      Observaciones
                    </h3>
                    <div className="flex gap-2 items-center">
                      <div>
                        <p className="bg-red-500 inline-block px-2 py-1 rounded text-white">
                          {clienteEncontrado.observacion_compromiso}
                        </p>
                      </div>
                      <div
                        className="group relative flex size-9 items-center justify-center gap-1 rounded-lg border border-black cursor-pointer"
                        onClick={() => {
                          setShowDialog(true);
                        }}
                      >
                        <div className="size-1 rounded-full bg-black duration-300 group-hover:opacity-0"></div>
                        <div className="relative size-1 origin-center rounded-full bg-black duration-300 before:absolute before:right-[2px] before:h-1 before:origin-right before:rounded-full before:bg-black before:delay-300 before:duration-300 after:absolute after:right-[2px] after:h-1 after:origin-right after:rounded-full after:bg-black after:delay-300 after:duration-300 group-hover:w-6 group-hover:before:w-3.5 group-hover:before:-rotate-45 group-hover:after:w-3.5 group-hover:after:rotate-45"></div>
                        <div className="size-1 rounded-full bg-black duration-300 group-hover:opacity-0"></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">
                      Fecha de compromiso
                    </h3>
                    <p>{clienteEncontrado.fecha_compromiso}</p>
                  </div>
                </div>
              </div>
            ) : clienteEncontrado.compromiso_terminado === "SI" ? (
              <div>
                <hr className="my-5 h-[1px] border-t-0 bg-gray-300" />
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">Compromiso</h3>
                    <p>{clienteEncontrado.categoria_compromiso}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">
                      Observaciones
                    </h3>
                    <div className="flex gap-2 items-center">
                      <div>
                        <p className="bg-red-500 inline-block px-2 py-1 rounded text-white">
                          {clienteEncontrado.observacion_compromiso}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">
                      Fecha de compromiso
                    </h3>
                    <p>{clienteEncontrado.fecha_compromiso}</p>
                  </div>
                </div>
              </div>
            ) : null}
            <hr className="my-5 h-[1px] border-t-0 bg-gray-300" />
            <div>
              {clienteEncontrado.estatus === "TERMINADO" ? (
                <div>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-primary">
                        Fecha de pago
                      </h3>
                      <p>{clienteEncontrado.fecha_pago}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-primary">
                        Dias de atraso
                      </h3>
                      <p>{dias}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-primary">
                        Estado de pago
                      </h3>
                      <p
                        className={`inline-block px-2 py-1 rounded ${
                          clienteEncontrado.estatus_pago === "PAGADA"
                            ? "bg-[#2E7D32] text-white"
                            : clienteEncontrado.estatus_pago ===
                              "SE MANDO RECIVO"
                            ? "bg-[#F57F17] text-white"
                            : clienteEncontrado.estatus_pago === "NO PAGADA"
                            ? "bg-red-500 text-white"
                            : "bg-gray-300 text-black" // Fondo por defecto si no coincide con ningún caso
                        }`}
                      >
                        {clienteEncontrado.estatus_pago}
                      </p>
                    </div>
                  </div>
                  <div>
                    {clienteEncontrado.observaciones != "" ? (
                      <div>
                        <h3 className="font-semibold text-primary">
                          Observaciones de pago
                        </h3>
                        <p>{clienteEncontrado.observaciones}</p>
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <hr className="my-5 h-[1px] border-t-0 bg-gray-300" />
                  </div>
                  <div className="grid gap-6 md:grid-cols-4 mt-5">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-primary">
                        Prima inicial
                      </h3>
                      <p>${clienteEncontrado.prima_inicial} MXN</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-primary">
                        Prima futura
                      </h3>
                      <p>${clienteEncontrado.prima_futura} MXN</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-primary">
                        Prima total
                      </h3>
                      <p>${clienteEncontrado.prima_total} MXN</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-primary">
                        Importe total
                      </h3>
                      <p>${clienteEncontrado.importe_total} MXN</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-primary">Observaciones</h3>
              {movimientos.map((dato, index) => (
                <div
                  key={index}
                  className="bg-muted p-4 rounded-lg space-y-2 bg-gray-100 my-5"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{dato.fecha}</p>
                    <p className="text-sm text-muted-foreground font-bold">
                      {dato.nombre}
                    </p>
                  </div>
                  <p>{dato.movimiento}</p>
                </div>
              ))}
            </div>
            {clienteEncontrado.estatus_pago === "PAGADA" &&
            clienteEncontrado.estatus === "TERMINADO" ? (
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    navigate("/tramites");
                  }}
                  className="flex gap-1 border bg-primary text-white py-2 px-3 rounded-lg hover:bg-white hover:text-black"
                >
                  Aceptar
                </button>
              </div>
            ) : (
              <div className="flex justify-between">
                <button
                  onClick={() =>
                    navigate(`/tramitecliente`, {
                      state: { id: id },
                    })
                  }
                  className="flex gap-1 border py-2 px-3 rounded-lg hover:bg-gray-100"
                >
                  <IconContext.Provider
                    value={{
                      className: "global-class-name",
                      size: "1.3em",
                    }}
                  >
                    <TbEdit />
                  </IconContext.Provider>
                  Editar
                </button>
                <button
                  onClick={() => {
                    navigate("/tramites");
                  }}
                  className="flex gap-1 border bg-primary text-white py-2 px-3 rounded-lg hover:bg-white hover:text-black"
                >
                  Aceptar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showDialog && (
        <CancelarComp
          onClose={() => setShowDialog(false)}
          id_tramite={clienteEncontrado.id_tramite}
        />
      )}
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default VistaTramite;
