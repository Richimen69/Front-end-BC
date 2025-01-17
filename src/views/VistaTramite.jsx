import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { fetchTramites } from "../services/tramitesClientes";
import { buscarMovimiento } from "../services/movimientos";
import { TbEdit } from "react-icons/tb";
function VistaTramite() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [movimientos, setMovimientos] = useState([]);

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
              <p className="text-sm text-muted-foreground font-bold">
                Fianza: {clienteEncontrado.fianza}
              </p>
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
                <h3 className="font-semibold text-primary">Afianzadora</h3>
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
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Movimiento</h3>
                <p>{clienteEncontrado.movimiento}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Estatus</h3>
                <p>{clienteEncontrado.estatus}</p>
              </div>
            </div>
            <div>
              <hr className="my-5 h-[1px] border-t-0 bg-gray-300" />
            </div>
            <div>
              {clienteEncontrado.estatus === "TERMINADO" ? (
                <div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-primary">
                        Fecha de pago
                      </h3>
                      <p>{clienteEncontrado.fecha_pago}</p>
                    </div>
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
            {clienteEncontrado.estatus === "TERMINADO" ? (
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
    </div>
  );
}

export default VistaTramite;
