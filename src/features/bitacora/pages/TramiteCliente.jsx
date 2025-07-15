import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { InputPrima } from "@/components/ui/InputPrima";
import { Pencil, Trash, Save, CircleX } from "lucide-react";
import {
  estatus,
  estatus_pagos,
  estadoTramite,
  estadoTramiteAseguradora,
  estatusTerminados,
  movimientosPermitidos,
} from "@/shared/utils/Constans";
import { fetchTramites } from "@/features/bitacora/services/tramitesClientes";
import { format, parse } from "date-fns";
import {
  obtenerMovimientos,
  obtenerTareas,
  obtenerTareasCompletas,
} from "@/features/bitacora/services/tareas";
import {
  buscarMovimiento,
  createMovimiento,
  deleteMovimiento,
  updateMovimiento,
} from "@/features/bitacora/services/movimientos";
import {
  fetchAfianzadoras,
  fetchBeficiarios,
} from "@/features/bitacora/services/datosTramites";
import { PendientesBC } from "@/features/bitacora/components/modals/PendientesBC";
function TramiteCliente() {
  const location = useLocation();
  const [movimientoEdit, setMovimientoEdit] = useState("");
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const [clientes, setClientes] = useState([]);
  const [observaciones, setMovimientos] = useState([]);
  const [afianzadoras, setAfianzadoras] = useState([]);
  const [beneficiario, setBeneficiario] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [estatusPagoSeleccionado, setEstatusPago] = useState(null);
  const [estadoTareas, setEstadoTareas] = useState(null);
  const [tempMovimiento, setTempMovimiento] = useState("");
  const [movimiento, setMovimiento] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [movimientosTar, setMovimientoTar] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tareas, setTareas] = useState([]);
  const opcionesTareas = [
    { value: 1, label: "Bloqueado" },
    { value: 0, label: "Desbloqueado" },
  ];
  const handleEdit = (id, currentMovimiento) => {
    setEditingId(id);
    setTempMovimiento(currentMovimiento);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTempMovimiento("");
  };

  const [tareasCompletas, setTareasCompletas] = useState([]);
  const parseDecimal = (valor) => Number((valor || "").replace(",", "."));
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
    beneficiario: "",
    fecha: "",
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
    const fetchAllData = async () => {
      try {
        const [beneficiariosData, movimientosData, afianzadorasData] =
          await Promise.all([
            fetchBeficiarios(),
            obtenerMovimientos(),
            fetchAfianzadoras(),
          ]);

        setBeneficiario(
          beneficiariosData.map((b) => ({
            value: b.nombre_ben,
            label: b.nombre_ben,
          }))
        );

        setMovimientoTar(movimientosData);

        setAfianzadoras(
          afianzadorasData.map((a) => ({
            value: a.nombre_afi,
            label: a.nombre_afi,
          }))
        );
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTramites();
        setClientes(data);

        const clienteEncontrado = data.find(
          (cliente) => cliente.id_tramite === id
        );

        if (
          clienteEncontrado &&
          movimientosTar.length > 0 &&
          afianzadoras.length > 0 &&
          beneficiario.length > 0
        ) {
          const tipoProcesoSeleccionado =
            estadoTramite.find(
              (option) => option.value === clienteEncontrado.tipo_proceso
            ) ||
            estadoTramiteAseguradora.find(
              (option) => option.value === clienteEncontrado.tipo_proceso
            );

          setFormData((prevState) => ({
            ...prevState,
            prima_inicial: clienteEncontrado.prima_inicial || "",
            prima_futura: clienteEncontrado.prima_futura || "",
            prima_total: clienteEncontrado.prima_total || "",
            importe_total: clienteEncontrado.importe_total || "",
            fianza: clienteEncontrado.fianza || "",
            fecha: clienteEncontrado.fecha || "",
            fechaPago: clienteEncontrado.fecha_pago || null,
            observaciones: clienteEncontrado.observaciones || "",
            fecha_termino: clienteEncontrado.fecha_termino || "",
            estatusSeleccionado:
              estatus.find(
                (option) => option.value === clienteEncontrado.estatus
              ) || null,
            movimientoSeleccionado: movimientosTar.find(
              (option) =>
                option.nombre.toLowerCase().trim() ===
                clienteEncontrado.movimiento.toLowerCase().trim()
            )
              ? {
                  value: clienteEncontrado.movimiento,
                  label: clienteEncontrado.movimiento,
                }
              : null,
            estadoTramite: tipoProcesoSeleccionado,
            afianzadora: afianzadoras.find(
              (option) => option.value === clienteEncontrado.afianzadora
            ),
            beneficiario: beneficiario.find(
              (option) => option.value === clienteEncontrado.beneficiario
            ),
          }));
          const estatusPagoPorDefecto = clienteEncontrado.estatus_pago;
          const estatusPagoSeleccionado =
            estatusPagoPorDefecto === "PAGADA"
              ? { value: "PAGADA", label: "PAGADA" }
              : estatus_pagos.find(
                  (option) => option.value === estatusPagoPorDefecto
                ) || { value: "PENDIENTE", label: "PENDIENTE" };

          setEstatusPago(estatusPagoSeleccionado);

          actualizarMovimientos(id);
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    if (
      movimientosTar.length > 0 &&
      afianzadoras.length > 0 &&
      beneficiario.length > 0
    ) {
      fetchData();
    }
  }, [movimientosTar, afianzadoras, beneficiario, id]);

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

  const handleChange = (field) => (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: selectedOption,
    }));
  };

  const handleEstatusChange = handleChange("estatusSeleccionado");
  const handleMovimientoChange = handleChange("movimientoSeleccionado");
  const handleEstadoTramiteChange = handleChange("estadoTramite");
  const handleAfianzadora = handleChange("afianzadora");
  const handleBeneficiario = handleChange("beneficiario");

  const handleEstatusPagoChange = (selectedOption) => {
    setEstatusPago(selectedOption);
  };
  const handleTareas = (selectedOption) => {
    setEstadoTareas(selectedOption);
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
      setMovimiento("");
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast.error("Hubo un problema al guardar las Observaciones.");
    }
  };

  const borrarMovimiento = async (id_movimiento) => {
    try {
      const result = await deleteMovimiento(id_movimiento); // Parsear la respuesta a JSON

      if (result.success) {
        toast.success("Observaciones borradas exitosamente.");
        actualizarMovimientos(id);
      } else {
        toast.error("Error al borrar las Observaciones."); // Mostrar mensaje de error si algo sale mal
      }
      setMovimiento(""); // Limpiar el estado relacionado si es necesario
    } catch (error) {
      console.error("Error al enviar la solicitud:", error); // Loguear errores si ocurren
      toast.error("Hubo un problema al borrar las Observaciones."); // Mostrar mensaje de error genérico
    }
  };
  const handleSave = async (id_movimiento) => {
    const fechaFormateada = format(new Date(), "dd/MM/yyyy HH:mm");
    try {
      const data = {
        movimiento: tempMovimiento,
        fecha: `${fechaFormateada}`,
        nombre: usuario,
        id_movimiento: id_movimiento,
      };

      const result = await updateMovimiento(data); // Parsear la respuesta a JSON

      if (result.success) {
        toast.success("Observacion actualizada exitosamente.");
        actualizarMovimientos(id);
      } else {
        toast.error("Error al actualizar");
        console.log(result); // Mostrar mensaje de error si algo sale mal
      }
      setMovimiento(""); // Limpiar el estado relacionado si es necesario
    } catch (error) {
      console.error("Error al enviar la solicitud:", error); // Loguear errores si ocurren
      toast.error("Hubo un problema al borrar las Observaciones."); // Mostrar mensaje de error genérico
    }
    setEditingId(null);
    setTempMovimiento("");
  };

  // Verificar si el cliente ha sido encontrado antes de intentar acceder a sus propiedades

  const handleSubmit = (e) => {
    e.preventDefault();
    const fechaFormateada = format(new Date(), "dd/MM/yyyy");
    const estatusPago =
      formData.fechaPago === null ? estatusPagoSeleccionado.value : "PAGADA";
    setFormData((prevState) => {
      const nuevaPrimaTotal =
        (Number(prevState.prima_inicial) || 0) +
        (Number(prevState.prima_futura) || 0);

      return {
        ...prevState, // Mantén el resto de las propiedades
        estatusPago: estatusPago || null,
        prima_total: nuevaPrimaTotal,
      };
    });

    // Mostrar el diálogo cambiando el estado
    setShowDialog(true);
  };

  const movimientosOptions = movimientosTar.map((mov) => ({
    value: mov.nombre,
    label: mov.nombre,
  }));

  const movimientoEncontrado = movimientosTar.find(
    (option) =>
      option.nombre.toLowerCase().trim() ===
      clienteEncontrado?.movimiento.toLowerCase().trim()
  );
  const idMovimientoSeleccionado = movimientoEncontrado
    ? movimientoEncontrado.id
    : null;

  useEffect(() => {
    const fetchData = async () => {
      const data = await obtenerTareas(idMovimientoSeleccionado);
      setTareas(data);
    };
    fetchData();
  }, [idMovimientoSeleccionado]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await obtenerTareasCompletas(id);
      setSeleccionadas(data);
    };
    fetchData();
  }, [id]);

  const [seleccionadas, setSeleccionadas] = useState([]);

  const toggleCheckbox = (id) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  function parseNumber(str) {
    if (!str) return 0;
    return parseFloat(str.replace(/,/g, ""));
  }

  if (!clienteEncontrado) {
    return (
      <div className="flex items-center justify-center p-20">
        <lottie-player
          autoplay
          loop
          mode="normal"
          src="/loader.json"
          style={{ width: "200px", height: "200px" }}
        ></lottie-player>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-5">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-lg bg-white p-6 shadow-xs border-t-4 border-teal-500">
          <div className="flex justify-between">
            <div className="space-y-1">
              <div className=" flex items-center text-sm text-gray-500">
                Fecha:
                <div className="flex  flex-col gap-2 ">
                  <DatePicker
                    selected={
                      formData.fecha
                        ? parse(formData.fecha, "dd/MM/yyyy", new Date()) // Convierte el string de tu estado a Date.
                        : null
                    }
                    onChange={(date) => {
                      if (date) {
                        const formattedDate = format(date, "dd/MM/yyyy");
                        setFormData((prevState) => ({
                          ...prevState,
                          fecha: formattedDate,
                        }));
                      }
                    }}
                    dateFormat="dd/MM/yyyy" // Obliga a mostrar el formato correcto en el DatePicker.
                  />
                </div>
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
          className="rounded-lg bg-white p-6 shadow-xs "
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
                  options={movimientosOptions}
                  value={formData.movimientoSeleccionado}
                  onChange={handleMovimientoChange}
                  placeholder="Seleccionar movimiento..."
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
                  Beneficiario:
                </label>
                <Select
                  options={beneficiario}
                  value={formData.beneficiario}
                  onChange={handleBeneficiario}
                  placeholder="Seleccionar beneficiario..."
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
                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-primary"
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

            {estatusTerminados.includes(formData.estatusSeleccionado.value) && (
              <div className="flex flex-col gap-y-5">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex flex-col gap-2 ">
                    <p className="text-sm font-medium text-teal-600">
                      Fecha de termino
                    </p>
                    <DatePicker
                      showIcon
                      toggleCalendarOnIconClick
                      selected={
                        formData.fecha_termino
                          ? parse(
                              formData.fecha_termino,
                              "dd/MM/yyyy",
                              new Date()
                            ) // Convierte el string de tu estado a Date.
                          : null
                      }
                      onChange={(date) => {
                        if (date) {
                          const formattedDate = format(date, "dd/MM/yyyy");
                          setFormData((prevState) => ({
                            ...prevState,
                            fecha_termino: formattedDate,
                          }));
                        }
                      }}
                      dateFormat="dd/MM/yyyy" // Obliga a mostrar el formato correcto en el DatePicker.
                      className=" block w-full rounded-md border border-gray-400 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
                {movimientosPermitidos.includes(
                  formData.movimientoSeleccionado.value
                ) && (
                  <div className="flex flex-col gap-y-5">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="flex  flex-col gap-2 ">
                        <p className="text-sm font-medium text-teal-600">
                          Fecha de pago
                        </p>
                        <DatePicker
                          showIcon
                          toggleCalendarOnIconClick
                          selected={
                            formData.fechaPago
                              ? parse(
                                  formData.fechaPago,
                                  "dd/MM/yyyy",
                                  new Date()
                                ) // Convierte el string de tu estado a Date.
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
                          className=" block w-full rounded-md border border-gray-400 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
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
                    <div className="grid gap-6 md:grid-cols-4 w-full">
                      <div>
                        <p className="text-sm font-medium text-teal-600">
                          Prima inicial
                        </p>
                        <InputPrima
                          value={formData.prima_inicial}
                          onChange={(value) =>
                            setFormData((prevState) => ({
                              ...prevState,
                              prima_inicial: value, // No convertir a 0, mantener el valor original
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
                          onChange={(value) =>
                            setFormData((prevState) => ({
                              ...prevState,
                              prima_futura: value, // No convertir a 0, mantener el valor original
                            }))
                          }
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-teal-600">
                          Prima total
                        </p>
                        <InputPrima
                          value={(() => {
                            // Función para calcular la suma correctamente
                            const inicial =
                              parseFloat(formData.prima_inicial) || 0;
                            const futura =
                              parseFloat(formData.prima_futura) || 0;
                            const total = inicial + futura;
                            return total === 0 ? "" : total;
                          })()}
                          disabled
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-teal-600">
                          Importe total
                        </p>
                        <InputPrima
                          value={formData.importe_total}
                          onChange={(value) =>
                            setFormData((prevState) => ({
                              ...prevState,
                              importe_total: value, // No convertir a 0, mantener el valor original
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
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
                tareas={seleccionadas.length > 0 ? seleccionadas : ""}
                idMovimiento={tareas.map((t) => t.id)}
              />
            )}
          </div>
        </form>
        <div>
          <div className="rounded-lg bg-white p-6 shadow-xs border-t-4 border-teal-500">
            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-100">
                <p className="block text-xl font-medium text-teal-600">
                  Lista de tareas
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">
                  {seleccionadas.length} de {tareas.length} completadas
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {clienteEncontrado.movimiento === "EXPEDICIÓN" ? (
                  <div>
                    <Select
                      options={opcionesTareas}
                      value={estadoTareas}
                      onChange={handleTareas}
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
                ) : null}

                {tareas.map((tarea, index) => {
                  const completada = seleccionadas.includes(tarea.id);
                  const key = tarea.tarea_id ?? `tarea-${index}`;
                  if (tarea.movimiento_id === 21) {
                    return (
                      <div
                        key={key}
                        className={`flex items-start gap-3 p-2 rounded-md transition-colors ${
                          completada ? "bg-gray-50" : ""
                        }`}
                      >
                        <button
                          onClick={() => toggleCheckbox(tarea.id)}
                          className="mt-0.5 shrink-0 focus:outline-hidden"
                          aria-label={
                            completada
                              ? "Marcar como incompleta"
                              : "Marcar como completada"
                          }
                        >
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              completada
                                ? "border-teal-500 bg-teal-500"
                                : "border-gray-300"
                            }`}
                          >
                            {completada && (
                              <svg
                                className="w-3 h-3 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 12L10 17L19 8"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </button>

                        <span
                          className={`text-sm ${
                            completada
                              ? "line-through text-gray-400"
                              : "text-gray-700"
                          }`}
                        >
                          {tarea.nombre}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={key}
                      className={`flex items-start gap-3 p-2 rounded-md transition-colors ${
                        completada ? "bg-gray-50" : ""
                      }`}
                    >
                      <button
                        onClick={() => toggleCheckbox(tarea.id)}
                        className="mt-0.5 shrink-0 focus:outline-hidden"
                        aria-label={
                          completada
                            ? "Marcar como incompleta"
                            : "Marcar como completada"
                        }
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            completada
                              ? "border-teal-500 bg-teal-500"
                              : "border-gray-300"
                          }`}
                        >
                          {completada && (
                            <svg
                              className="w-3 h-3 text-white"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5 12L10 17L19 8"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </button>

                      <span
                        className={`text-sm ${
                          completada
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {tarea.nombre}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-xs">
          <p className="block text-xl font-medium text-teal-600">
            Observaciones
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-5">
            {observaciones.map((dato, index) => {
              const isEditing = editingId === dato.id_movimiento; // Definir isEditing para cada elemento
              return (
                <div
                  key={dato.id_movimiento || `observation-${index}`}
                  className="z-50 flex w-full rounded-xl border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-200"
                >
                  <div className="p-4 flex items-start justify-between w-full">
                    <div className="space-y-2 flex-1">
                      {isEditing ? (
                        <>
                          <textarea
                            type="text"
                            placeholder={dato.movimiento}
                            value={tempMovimiento}
                            onChange={(e) => setTempMovimiento(e.target.value)}
                            className="w-full border rounded px-2 py-1 text-gray-700 text-base"
                          />
                        </>
                      ) : (
                        <>
                          <p className="text-amber-600 font-medium text-lg">
                            {dato.fecha}
                          </p>
                          <p className="text-gray-700 text-base whitespace-pre-wrap">
                            {dato.movimiento}
                          </p>
                          <p className="mt-3 text-sm text-black/80 font-bold">
                            {dato.nombre}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(dato.id_movimiento)}
                            className="h-8 w-8 flex items-center justify-center rounded-md border border-green-200 text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                          >
                            <Save />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="h-8 w-8 flex items-center justify-center rounded-md border border-rose-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
                            aria-label="Cancelar edición"
                          >
                            <CircleX />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleEdit(dato.id_movimiento, dato.movimiento)
                            }
                            className="h-8 w-8 flex items-center justify-center rounded-md border border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            aria-label="Editar observación"
                          >
                            <Pencil strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => borrarMovimiento(dato.id_movimiento)}
                            className="h-8 w-8 flex items-center justify-center rounded-md border border-rose-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
                            aria-label="Eliminar observación"
                          >
                            <Trash strokeWidth={2} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="w-full flex justify-center items-center">
              {mostrarFormulario && (
                <div className="w-full">
                  <div>
                    <textarea
                      type="text"
                      className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
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
              className="group cursor-pointer outline-hidden hover:rotate-90 duration-300"
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
