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
import { estatus, estatus_pagos } from "../components/Constans";
function TramiteCliente() {
  const location = useLocation();
  const [clientes, setClientes] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [fechaTermino, setFechaTermino] = useState(null);
  const [fechaPago, setFechaPago] = useState(null);
  const [movimiento, setMovimiento] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [fianza, setFianza] = useState("");
  const [prima_inicial, setPrima_inicial] = useState("");
  const [prima_futura, setPrima_futura] = useState("");
  const [prima_total, setPrima_total] = useState("");
  const [importe_total, setImporte_total] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const apiUrl = "https://bitacorabc.site/backend/";
  const [estatusSeleccionado, setEstatus] = useState(null);
  const { id } = location.state || {}; // Obtener el id desde el estado
  const navigate = useNavigate();
  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };
  if (!id) {
    return <div>Error: No se encontró el ID del cliente.</div>;
  }

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch(`${apiUrl}tramites.php`);
        const data = await response.json();
        setClientes(data);

        // Encontrar el cliente por el id
        const clienteEncontrado = data.find(
          (cliente) => cliente.id_tramite === id
        );
        setPrima_inicial(clienteEncontrado.prima_inicial);
        setPrima_futura(clienteEncontrado.prima_futura);
        setPrima_total(clienteEncontrado.prima_total);
        setImporte_total(clienteEncontrado.importe_total);
        setImporte_total(clienteEncontrado.importe_total);
        setFianza(clienteEncontrado.fianza);
        setFechaTermino(clienteEncontrado?.fecha_termino?.trim() || null);
        setFechaPago(clienteEncontrado?.fecha_pago?.trim() || null);
        setObservaciones(clienteEncontrado.observaciones);
        // Si se encuentra el cliente, establecer el estatus por defecto
        const estatusPorDefecto = clienteEncontrado.estatus;
        const estatusDefaultOption = estatus.find(
          (option) => option.value === estatusPorDefecto
        );
        setEstatus(estatusDefaultOption);

        console.log(clienteEncontrado);

        const movimientosResponse = await fetch(
          `${apiUrl}movimientos.php?id=${id}`
        );
        const movimientosData = await movimientosResponse.json();

        setMovimientos(
          movimientosData.map((movimiento) => ({
            id_movimiento: movimiento.id_movimiento,
            movimiento: movimiento.movimiento,
            fecha: movimiento.fecha,
            nombre: movimiento.nombre,
            id_tramite: movimiento.id_tramite,
          }))
        );
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    fetchClientes();
  }, [id]); // Dependencia del id para actualizar si cambia

  const handleEstatusChange = (selectedOption) => {
    setEstatus(selectedOption);
  };

  // Buscar el cliente por el id
  const clienteEncontrado = clientes.find(
    (cliente) => cliente.id_tramite === id
  );

  const alerta = async (e) => {
    e.preventDefault();

    toast.custom(
      (t) => (
        <div className="flex flex-col items-center justify-center bg-white p-10 rounded-3xl shadow-2xl border border-primary">
          <p className="text-primary text-xl">¿Desea guardar cambios?</p>
          <div className="flex gap-5 mt-5">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                handleSubmit(); // Llamamos a handleSubmit cuando el usuario confirma
              }}
              className="p-2 bg-[#16C47F] rounded-xl w-[100px] hover:bg-[#16C47F] hover:opacity-40 text-white transition ease-in-out  hover:-translate-y-1 hover:scale-110 duration-300"
            >
              Confirmar
            </button>
            <button
              onClick={() => toast.dismiss(t.id)} // Cierra la alerta si el usuario cancela
              className="p-2 bg-[#E82561] rounded-xl hover:bg-red-300 w-[100px] text-white transition ease-in-out  hover:-translate-y-1 hover:scale-110 duration-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Mantener la alerta visible hasta que se decida
      }
    );
  };

  const agregarMovimiento = async (e) => {
    e.preventDefault();
    const fecha = new Date();
    const opciones = { day: "2-digit", month: "2-digit", year: "numeric" };
    const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");
    const horaFormateada = `${horas}:${minutos}`;
    setMostrarFormulario(false);
    const data = {
      movimiento: movimiento,
      fecha: `${fechaFormateada} ${horaFormateada}`,
      nombre: "Ricardo",
      id_tramite: id,
    };

    try {
      const response = await fetch(`${apiUrl}movimientos.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(response);
      const result = await response.json();
      if (result.success) {
        toast.success("Movimiento guardado exitosamente.");
        handleSubmit();
        navigate(0);
      } else {
        toast.error("Error al guardar el movimiento.");
      }
      console.log(result);
      setMovimiento("");
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast.error("Hubo un problema al guardar el movimiento.");
    }
  };

  const borrarMovimiento = async ( id_movimiento) => {
    try {
      const response = await fetch(`${apiUrl}movimientos.php`, {
        method: "DELETE", // Método DELETE para eliminar el recurso
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_movimiento: id_movimiento }), // Enviar el id_tramite en el cuerpo de la solicitud
      });

      const result = await response.json(); // Parsear la respuesta a JSON

      if (response.ok && result.success) {
        toast.success("Movimiento borrado exitosamente.");
        setTimeout(() => {
          handleSubmit();
          navigate(0);
        }, 1500);
      } else {
        toast.error("Error al borrar el movimiento."); // Mostrar mensaje de error si algo sale mal
      }

      console.log(result); // Loguear el resultado para debugging
      setMovimiento(""); // Limpiar el estado relacionado si es necesario
    } catch (error) {
      console.error("Error al enviar la solicitud:", error); // Loguear errores si ocurren
      toast.error("Hubo un problema al borrar el movimiento."); // Mostrar mensaje de error genérico
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

  const handleSubmit = async () => {
    const fecha = new Date();
    const opciones = { day: "2-digit", month: "2-digit", year: "numeric" };
    const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");
    const horaFormateada = `${horas}:${minutos}`;
    const estatusPago = fechaPago === null ? "NO PAGADA" : "PAGADA";
    const estatusTerminado =
      estatusSeleccionado?.value === "TERMINADO"
        ? `${fechaFormateada} ${horaFormateada}`
        : null;
    const data = {
      id_tramite: id,
      estatus: estatusSeleccionado?.value || "", // Manejar valor no definido
      observaciones: observaciones || "",
      fianza: fianza || "",
      prima_inicial: prima_inicial || "",
      prima_futura: prima_futura || "",
      prima_total: prima_total || 0,
      importe_total: importe_total || 0,
      fecha_termino: estatusTerminado || null,
      fecha_pago: fechaPago || null,
      estatus_pago: estatusPago,
    };
    try {
      const response = await fetch(`${apiUrl}tramites.php`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(response);
      const result = await response.json();
      if (result.success) {
        toast.success("Trámite guardado exitosamente.");
        setTimeout(() => {
          navigate("/tramites");
        }, 1500);
      } else {
        toast.error("Error al guardar el trámite.");
      }
      console.log(result);
      console.log(data);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast.error("Hubo un problema al guardar el trámite.");
    }
  };

  return (
    <div className="flex items-center justify-center p-5">
      <div className="bg-white w-4/6 p-5 rounded-xl shadow-2xl">
        <form onSubmit={alerta}>
          <div className="flex justify-between">
            <p className="text-primary font-bold">
              Fecha: {clienteEncontrado.fecha}
            </p>
            <p className="text-primary font-bold">
              Folio: {clienteEncontrado.folio}
            </p>
          </div>
          {clienteEncontrado.fecha_termino != null ? (
            <div>
              <p className="text-primary font-bold">Fecha de Termino:</p>
              <p>{clienteEncontrado.fecha_termino}</p>
            </div>
          ) : null}
          <div>
            <p className="text-primary font-bold">Fiado:</p>
            <p>{clienteEncontrado.nombre}</p>
          </div>
          <div className="flex gap-20 pt-5">
            <div>
              <p className="text-primary font-bold">Afianzadora:</p>
              <p>{clienteEncontrado.afianzadora}</p>
            </div>
            <div>
              <p className="block text-primary font-bold">Movimiento:</p>
              <p>{clienteEncontrado.movimiento}</p>
            </div>
            <div>
              <p className="block text-primary font-bold">Agente:</p>
              <p>{clienteEncontrado.agente}</p>
            </div>
            <div>
              <p className="block text-primary font-bold">Beneficiario:</p>
              <p>{clienteEncontrado.beneficiario}</p>
            </div>
          </div>
          <div className="flex gap-20 pt-5">
            {clienteEncontrado.estatus != "TERMINADO" ? (
              <div className="mb-4">
                <label className="block text-primary font-bold">Estatus:</label>
                <Select
                  options={estatus}
                  defaultValue={estatusSeleccionado}
                  value={estatusSeleccionado}
                  onChange={handleEstatusChange}
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
            ) : (
              <div>
                <p className="block text-primary font-bold">Estatus:</p>
                <p>{clienteEncontrado.estatus}</p>
              </div>
            )}

            <div>
              <label htmlFor="fianza" className="block text-primary font-bold">
                Fianza
              </label>
              <div>
                <input
                  type="text"
                  value={fianza}
                  onChange={(e) => setFianza(e.target.value)}
                  name="fianza"
                  className="block w-36 rounded-md py-1.5 text-[14px] px-2 ring-1 ring-inset ring-gray-400 focus:outline-primary"
                />
              </div>
            </div>
          </div>
          <div className="pt-5 flex gap-20 ">
            <div>
              <p className="block text-primary font-bold">Fecha de pago</p>
              <DatePicker
                showIcon
                toggleCalendarOnIconClick
                selected={fechaPago}
                onChange={(date) => {
                  if (date) {
                    setFechaPago(date);
                  }
                }}
                className="block w-36 rounded-md py-1.5 text-[14px] px-2 ring-1 ring-inset ring-gray-400 focus:outline-primary"
              />
            </div>
            <div>
              <p className="block text-primary font-bold">Estatus de pago:</p>
              <p className="mt-1">{clienteEncontrado.estatus_pago}</p>
            </div>
          </div>
          <div className="flex gap-20 mt-10">
            <div>
              <p className="block text-primary font-bold">Prima inicial</p>
              <InputPrima
                value={prima_inicial}
                onChange={(e) => setPrima_inicial(e.target.value)}
              />
            </div>
            <div>
              <p className="block text-primary font-bold">Prima futura</p>
              <InputPrima
                value={prima_futura}
                onChange={(e) => setPrima_futura(e.target.value)}
              />
            </div>
            <div>
              <p className="block text-primary font-bold">Prima total</p>
              <InputPrima
                value={(Number(prima_futura) || 0) + (Number(prima_inicial) || 0)}
                onChange={(e) => setPrima_total(e.target.value)}
                disabled
              />
            </div>
            <div>
              <p className="block text-primary font-bold">Importe total</p>
              <InputPrima
                value={importe_total}
                onChange={(e) => setImporte_total(e.target.value)}
                disabled
              />
            </div>
          </div>
          <div className="pt-10">
            <p className="block text-primary font-bold">
              Observaciones de pago
            </p>
            <textarea
              type="text"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3 py-2 focus:outline-primary border-2 rounded"
              placeholder=""
            ></textarea>
          </div>
          <div className="flex items-center justify-center p-5 gap-5">
            <button
              className="w-[200px] border border-primary hover:bg-primary hover:text-white p-3 px-5 rounded-lg transition ease-in-out  hover:-translate-y-1 hover:scale-110 duration-300"
              type="submit"
            >
              Guardar cambios
            </button>
            <button
              className="w-[200px] text-white border border-[#E82561] hover:opacity-80 bg-[#E82561] hover:text-white p-3 px-5 rounded-lg transition ease-in-out  hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={() => {navigate("/tramites")}}
            >
              Cancelar
            </button>
          </div>
        </form>
        <div className="pt-5">
          <p className="text-center font-bold text-primary text-2xl">
            Observaciones
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {movimientos.map((dato, index) => (
              <div
                key={index}
                className=" z-50 flex  w-5/6 rounded-xl border border-primary"
              >
                <div className="flex w-full items-center">
                  <div className="bg-[#FFF574] rounded-tl-xl rounded-bl-xl w-4 h-full"></div>
                  <div className="mx-2.5 flex-grow px-4">
                    <p className="mt-1.5 text-xl font-bold text-[peru] leading-8 mr-3 text-ellipsis ">
                      {dato.fecha}
                    </p>
                    <p className="leading-5 break-words text-primary">
                      {dato.movimiento}
                    </p>
                    <p className="text-sm text-black/40">{dato.nombre}</p>
                  </div>
                  <div className=" px-4 py-2 rounded">
                    {estatusSeleccionado?.value != "TERMINADO" ? (
                      <button onClick={() => borrarMovimiento(dato.id_movimiento)}>
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
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
            <div className="w-full flex justify-center items-center">
              {mostrarFormulario && (
                <div className="w-5/6">
                  <div>
                    <textarea
                      type="text"
                      className="w-full px-3 py-2 focus:outline-primary border-2 rounded"
                      value={movimiento}
                      onChange={(e) => setMovimiento(e.target.value)}
                      placeholder="Observaciones"
                    />
                  </div>
                  <div className=" flex flex-col items-center justify-center">
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
            {estatusSeleccionado?.value != "TERMINADO" ? (
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
            ) : null}
          </div>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default TramiteCliente;
