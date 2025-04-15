import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Toaster, toast } from "sonner";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { InputPrima } from "../components/ui/InputPrima";
import {
  estatus,
  estatus_pagos,
  estadoTramite,
  movimientos,
  estadoTramiteAseguradora,
} from "../utils/Constans";
import { fetchTramites } from "../services/tramitesClientes";
import { format, parse } from "date-fns";
import { updateTramite } from "../services/tramitesClientes";
import {
  buscarMovimiento,
  createMovimiento,
  deleteMovimiento,
} from "../services/movimientos";
import { fetchAfianzadoras } from "@/services/datosTramites";
import { PendientesBC } from "@/components/forms/bitacora/PendientesBC";
function TramiteCliente() {
  const location = useLocation();
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const [clientes, setClientes] = useState([]);
  const [observaciones, setMovimientos] = useState([]);
  const [afianzadoras, setAfianzadoras] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [estatusPagoSeleccionado, setEstatusPago] = useState(null);
  const [movimiento, setMovimiento] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { id } = location.state || {};
  const [formData, setFormData] = useState({
    id: location.state.id,
    estatusSeleccionado: null,
    movimientoSeleccionado: null,
    estatusPago: null,
    fechaPago: null,
    fecha_termino: null,
    observaciones: "",
    fianza: "",
    prima_inicial: "",
    prima_futura: "",
    prima_total: "",
    importe_total: "",
    estadoTramite: "",
    afianzadora: "",
  });

  // Obtener el id desde el estado

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };
  if (!id) {
    return <div>Error: No se encontró el ID del cliente.</div>;
  }

  useEffect(() => {
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const formattedUser =
          user.usuario_usu.charAt(0).toUpperCase() +
          user.usuario_usu.slice(1).toLowerCase();
        setUsuario(formattedUser);
      } catch (error) {
        console.error(
          "Error al analizar el usuario desde localStorage:",
          error
        );
      }
    }
  }, [storedUser]);

  useEffect(() => {
    const fetchData = async () => {
      const afianzadorasData = await fetchAfianzadoras();
      setAfianzadoras(
        afianzadorasData.map((afianzadora) => ({
          value: afianzadora.nombre_afi,
          label: afianzadora.nombre_afi,
        }))
      );
    };
    fetchData();
  }, []);

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
          setFormData((prevState) => ({
            ...prevState, // Mantén el resto de las propiedades
            prima_inicial: clienteEncontrado.prima_inicial || "",
            prima_futura: clienteEncontrado.prima_futura || "",
            prima_total: clienteEncontrado.prima_total || "",
            importe_total: clienteEncontrado.importe_total || "",
            fianza: clienteEncontrado.fianza || "",
            fechaPago: clienteEncontrado.fecha_pago || null,
            observaciones: clienteEncontrado.observaciones || "",
            estatusSeleccionado:
              estatus.find(
                (option) => option.value === clienteEncontrado.estatus
              ) || null,
            movimientoSeleccionado:
              movimientos.find(
                (option) => option.value === clienteEncontrado.movimiento
              ) || null,
            estadoTramite:
              estadoTramite.find(
                (option) => option.value === clienteEncontrado.tipo_proceso
              ) ||
              estadoTramiteAseguradora.find(
                (option) => option.value === clienteEncontrado.tipo_proceso
              ),
            afianzadora: afianzadoras.find(
              (option) => option.value === clienteEncontrado.afianzadora
            ),
          }));

          const estatusPagoPorDefecto = clienteEncontrado.estatus_pago;
          // Verificar si el valor de estatus_pago es "PAGADA"
          if (estatusPagoPorDefecto === "PAGADA") {
            setEstatusPago({ value: "PAGADA", label: "PAGADA" });
          } else {
            // Si no es "PAGADA", buscar el valor en estatus_pagos o asignar "PENDIENTE"
            const estatusPagoSeleccionado = estatus_pagos.find(
              (option) => option.value === estatusPagoPorDefecto
            );
            setEstatusPago(
              estatusPagoSeleccionado || {
                value: "PENDIENTE",
                label: "PENDIENTE",
              }
            );
          }

          // Obtener movimientos
          actualizarMovimientos(id);
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchData();
    if (afianzadoras.length > 0) {
      fetchData();
    }
  }, [afianzadoras, id]);

  const actualizarMovimientos = async (id) => {
    try {
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
        setMovimientos([]); // Si no hay movimientos, establece el estado como vacío
      }
    } catch (error) {
      console.error("Error al obtener los movimientos:", error);
    }
  };

  const handleEstatusChange = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      estatusSeleccionado: selectedOption,
    }));
  };
  const handleMovimientoChange = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      movimientoSeleccionado: selectedOption,
    }));
  };
  const handleEstadoTramiteChange = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      estadoTramite: selectedOption,
    }));
  };
  const handleEstatusPagoChange = (selectedOption) => {
    setEstatusPago(selectedOption);
  };
  const handleAfianzadora = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      afianzadora: selectedOption,
    }));
  };

  // Buscar el cliente por el id
  const clienteEncontrado = clientes.find(
    (cliente) => cliente.id_tramite === id
  );

  const agregarMovimiento = async (e) => {
    e.preventDefault();
    const fechaFormateada = format(new Date(), "dd/MM/yyyy HH:mm");
    setMostrarFormulario(false);
    const data = {
      movimiento: movimiento,
      fecha: `${fechaFormateada}`,
      nombre: usuario,
      id_tramite: id,
    };

    try {
      const result = await createMovimiento(data);
      if (result.success) {
        toast.success("Observaciones guardadas exitosamente.");
        actualizarMovimientos(id);
        setMovimientos((prevMovimientos) => [
          ...prevMovimientos,
          {
            id_movimiento: result.id_movimiento,
            movimiento: movimiento,
            fecha: fechaFormateada,
            nombre: usuario,
            id_tramite: id,
          },
        ]);
      } else {
        toast.error("Error al guardar Observaciones.");
      }
      console.log(result);
      setMovimiento("");
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast.error("Hubo un problema al guardar las Observaciones.");
    }
  };

  const borrarMovimiento = async (id_movimiento) => {
    console.log(movimientos);
    try {
      const result = await deleteMovimiento(id_movimiento); // Parsear la respuesta a JSON

      if (result.success) {
        toast.success("Observaciones borradas exitosamente.");
        setMovimientos((prevMovimientos) =>
          prevMovimientos.filter((mov) => mov.id_movimiento !== id_movimiento)
        );
      } else {
        toast.error("Error al borrar las Observaciones."); // Mostrar mensaje de error si algo sale mal
      }

      console.log(result); // Loguear el resultado para debugging
      setMovimiento(""); // Limpiar el estado relacionado si es necesario
    } catch (error) {
      console.error("Error al enviar la solicitud:", error); // Loguear errores si ocurren
      toast.error("Hubo un problema al borrar las Observaciones."); // Mostrar mensaje de error genérico
    }
  };

  // Verificar si el cliente ha sido encontrado antes de intentar acceder a sus propiedades
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const fechaFormateada = format(new Date(), "dd/MM/yyyy");
    const estatusPago =
      formData.fechaPago === null ? estatusPagoSeleccionado.value : "PAGADA";
    const estatusTerminado =
      formData.estatusSeleccionado.value === "TERMINADO"
        ? `${fechaFormateada}`
        : null;

    setFormData((prevState) => {
      const nuevaPrimaTotal =
        (Number(prevState.prima_inicial) || 0) +
        (Number(prevState.prima_futura) || 0);

      return {
        ...prevState, // Mantén el resto de las propiedades
        estatusPago: estatusPago || null,
        fecha_termino: estatusTerminado || null,
        prima_total: nuevaPrimaTotal,
      };
    });

    // Mostrar el diálogo cambiando el estado
    setShowDialog(true);
  };

  return (
    <div className="flex items-center justify-center p-5">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex justify-between">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">
                Fecha:
                <span className="text-gray-900">{clienteEncontrado.fecha}</span>
              </div>
              {clienteEncontrado.fecha_termino != null ? (
                <div className="text-sm text-gray-500">
                  Fecha de Término:
                  <span className="text-gray-900">
                    {clienteEncontrado.fecha_termino}
                  </span>
                </div>
              ) : null}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Folio:
                <span className="font-medium text-teal-600">
                  {clienteEncontrado.folio}
                </span>
              </div>
            </div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-teal-600">Fiado</label>
              <div className="mt-1 text-gray-900">
                {clienteEncontrado.nombre}
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div>
                  <label className="text-sm font-medium text-teal-600">
                    {clienteEncontrado.movimiento === "SEGURO RC"
                      ? "Aseguradora"
                      : "Afianzadora"}
                  </label>
                  <Select
                    options={afianzadoras}
                    value={formData.afianzadora}
                    onChange={handleAfianzadora}
                    placeholder="Seleccionar estatus..."
                    className="mt-1"
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary25: "#DDBE86",
                        primary: "#076163",
                      },
                    })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-teal-600">
                  Movimiento:
                </label>
                <Select
                  options={movimientos}
                  defaultValue={formData.movimientoSeleccionado}
                  value={formData.movimientoSeleccionado}
                  onChange={handleMovimientoChange}
                  placeholder="Seleccionar estatus..."
                  className="mt-1"
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#DDBE86",
                      primary: "#076163",
                    },
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-teal-600">
                  Agente
                </label>
                <div className="mt-1 text-gray-900">
                  {clienteEncontrado.agente}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-teal-600">
                  Beneficiario
                </label>
                <div className="mt-1 text-gray-900">
                  {clienteEncontrado.beneficiario}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-teal-600">
                  Estatus:
                </label>
                <Select
                  options={estatus}
                  defaultValue={formData.estatusSeleccionado}
                  value={formData.estatusSeleccionado}
                  onChange={handleEstatusChange}
                  placeholder="Seleccionar estatus..."
                  className="mt-1"
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#DDBE86",
                      primary: "#076163",
                    },
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-teal-600">
                  {clienteEncontrado.movimiento === "SEGURO RC"
                    ? "Póliza"
                    : "Fianza"}
                </label>

                <input
                  type="text"
                  value={formData.fianza}
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      fianza: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-teal-600">
                  Estatus trámite
                </label>
                <Select
                  options={
                    clienteEncontrado.movimiento === "SEGURO RC"
                      ? estadoTramiteAseguradora
                      : estadoTramite
                  }
                  defaultValue={formData.estadoTramite}
                  value={formData.estadoTramite}
                  onChange={handleEstadoTramiteChange}
                  placeholder="Seleccionar estatus..."
                  className="mt-1"
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#DDBE86",
                      primary: "#076163",
                    },
                  })}
                />
              </div>
            </div>

            {formData.estatusSeleccionado.value === "TERMINADO" ||
            formData.estatusSeleccionado.value === "TERMINADO/COMPROMISO" ? (
              <div>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex  flex-col gap-2 ">
                    <p className="text-sm font-medium text-teal-600">
                      Fecha de pago
                    </p>
                    <DatePicker
                      showIcon
                      toggleCalendarOnIconClick
                      selected={
                        formData.fechaPago
                          ? parse(formData.fechaPago, "dd/MM/yyyy", new Date()) // Convierte el string de tu estado a Date.
                          : null
                      }
                      onChange={(date) => {
                        if (date) {
                          const formattedDate = format(date, "dd/MM/yyyy");
                          setFormData((prevState) => ({
                            ...prevState,
                            fechaPago: formattedDate,
                          }));
                        }
                      }}
                      dateFormat="dd/MM/yyyy" // Obliga a mostrar el formato correcto en el DatePicker.
                      className=" block w-full rounded-md border border-gray-400 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-teal-600">
                      Estado de pago:
                    </label>

                    {estatusPagoSeleccionado.value === "PAGADA" ? (
                      <div>
                        <p className="mt-1">PAGADA</p>
                      </div>
                    ) : (
                      <div>
                        <Select
                          options={estatus_pagos}
                          defaultValue={estatusPagoSeleccionado}
                          value={estatusPagoSeleccionado}
                          onChange={handleEstatusPagoChange}
                          placeholder="Seleccionar estatus..."
                          theme={(theme) => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              primary25: "#DDBE86",
                              primary: "#076163",
                            },
                          })}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {estatusPagoSeleccionado.value === "NO PAGADA" ? (
                  <div className=" flex items-center justify-center">
                    <div className="w-3/6">
                      <p className="text-sm font-medium text-teal-600">
                        Observaciones de pago
                      </p>
                      <textarea
                        type="text"
                        value={formData.observaciones}
                        onChange={(e) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            observaciones: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 focus:outline-primary border-2 rounded"
                        placeholder=""
                      ></textarea>
                    </div>
                  </div>
                ) : null}
                <div className="grid gap-6 md:grid-cols-4">
                  <div>
                    <p className="text-sm font-medium text-teal-600">
                      Prima inicial
                    </p>
                    <InputPrima
                      value={formData.prima_inicial}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          prima_inicial: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-600">
                      Prima futura
                    </p>
                    <InputPrima
                      value={formData.prima_futura}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          prima_futura: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-600">
                      Prima total
                    </p>
                    <InputPrima
                      value={
                        (Number(formData.prima_inicial) || 0) +
                        (Number(formData.prima_futura) || 0)
                      }
                      disabled
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-600">
                      Importe total
                    </p>
                    <InputPrima
                      value={formData.importe_total}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          importe_total: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-center p-5 gap-5">
            <button
              className="w-[200px] border border-primary hover:bg-primary hover:text-white p-3 px-5 rounded-lg transition ease-in-out  hover:-translate-y-1 hover:scale-110 duration-300"
              type="submit"
            >
              Guardar cambios
            </button>

            <button
              className="w-[200px] text-white border border-[#E82561] hover:opacity-80 bg-[#E82561] hover:text-white p-3 px-5 rounded-lg transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={(e) => {
                e.preventDefault();
                navigate("/tramites");
              }}
            >
              Cancelar
            </button>
            {showDialog && (
              <PendientesBC
                onClose={() => setShowDialog(false)}
                id={id}
                datosCliente={formData}
              />
            )}
          </div>
        </form>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="block text-xl font-medium text-teal-600">
            Observaciones
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-5">
            {observaciones.map((dato, index) => (
              <div
                key={index}
                className=" z-50 flex w-full rounded-xl border border-gray-300 "
              >
                <div className="flex w-full items-center py-1 ">
                  <div className="mx-2.5 flex-grow px-4">
                    <p className=" text-xl font-bold text-[peru] leading-8 mr-3 text-ellipsis ">
                      {dato.fecha}
                    </p>
                    <p className="leading-5 break-words text-primary">
                      {dato.movimiento}
                    </p>
                    <p className="mt-3 text-sm text-black/80 font-bold">
                      {dato.nombre}
                    </p>
                  </div>
                  <div className=" px-4 py-2 rounded">
                    <button
                      onClick={() => borrarMovimiento(dato.id_movimiento)}
                    >
                      <IconContext.Provider
                        value={{
                          color: "#E82561",
                          className: "global-class-name",
                          size: "1.5em",
                        }}
                      >
                        <FaTrash />
                      </IconContext.Provider>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="w-full flex justify-center items-center">
              {mostrarFormulario && (
                <div className="w-full">
                  <div>
                    <textarea
                      type="text"
                      className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      value={movimiento}
                      onChange={(e) => setMovimiento(e.target.value)}
                      placeholder="Observaciones"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center mt-5">
                    <button
                      className="rounded w-1/5 border border-primary p-2 text-center cursor-pointer hover:bg-primary hover:text-white"
                      onClick={agregarMovimiento}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center p-5">
            <button
              className="group cursor-pointer outline-none hover:rotate-90 duration-300"
              title="Agregar movimiento"
              onClick={toggleFormulario}
            >
              <svg
                className="stroke-teal-500 fill-none group-hover:fill-teal-800 group-active:stroke-teal-200 group-active:fill-teal-600 group-active:duration-0 duration-300"
                viewBox="0 0 24 24"
                height="50px"
                width="50px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeWidth="1.5"
                  d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                ></path>
                <path strokeWidth="1.5" d="M8 12H16"></path>
                <path strokeWidth="1.5" d="M12 16V8"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default TramiteCliente;
