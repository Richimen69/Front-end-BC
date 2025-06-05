import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Toaster, toast } from "sonner";
import { agente, movimientos } from "@/utils/Constans";
import { fetchFolios } from "@/services/tramitesClientes";
import DatePicker from "react-datepicker";
import { parse } from "date-fns";
import {
  fetchClientes,
  fetchAfianzadoras,
  fetchBeficiarios,
} from "@/services/datosTramites";
import { createTramite } from "@/services/tramitesClientes";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
const FormularioTramite = ({ isVisible, onClose }) => {
  const storedUser = localStorage.getItem("user");
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [afianzadoras, setAfianzadoras] = useState([]);
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [movimientoSeleccionado, setMovimiento] = useState(null);
  const [agenteSeleccionado, setAgente] = useState(null);
  const [fecha, setFecha] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [folios, setFolios] = useState([]);
  const [afianzadoraSeleccionada, setAfianzadoraSeleccionada] = useState(null);
  const [btnSave, setBtnSave] = useState(false);
  const [loading, setLoading] = useState(false);

  const [beneficiarioSeleccionado, setBeneficiarioSeleccionado] =
    useState(null);
  const [usuario, setUsuario] = useState("");
  useEffect(() => {
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const formattedUser = user.usuario_usu.charAt(0).toUpperCase();
        setUsuario(formattedUser);
      } catch (error) {
        console.error(
          "Error al analizar el usuario desde localStorage:",
          error
        );
      }
    }
    // Función para cargar datos desde diferentes endpoints
    const fetchData = async () => {
      try {
        // Cargar clientes
        const clientesData = await fetchClientes();
        setClientes(
          clientesData.map((cliente) => ({
            value: cliente.id_cli,
            label: cliente.nombre_cli,
          }))
        );

        const obtenerFolios = await fetchFolios();
        setFolios(obtenerFolios.folios);

        // Cargar afianzadoras
        const afianzadorasData = await fetchAfianzadoras();
        setAfianzadoras(
          afianzadorasData.map((afianzadora) => ({
            value: afianzadora.id_afi,
            label: afianzadora.nombre_afi,
          }))
        );

        // Cargar beneficiarios
        const beneficiariosData = await fetchBeficiarios();
        setBeneficiarios(
          beneficiariosData.map((beneficiario) => ({
            value: beneficiario.nombre_ben,
            label: beneficiario.nombre_ben,
          }))
        );
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const generarFolio = () => {
    const inicial = usuario.charAt(0).toUpperCase();
    const foliosUsuario = folios
      .filter((folio) => folio.startsWith(inicial + "-"))
      .map((folio) => parseInt(folio.split("-")[1]))
      .sort((a, b) => a - b);
    const ultimoNumero =
      foliosUsuario.length > 0 ? foliosUsuario[foliosUsuario.length - 1] : 0;

    const nuevoNumero = (ultimoNumero + 1).toString().padStart(4, "0");

    return `${inicial}-${nuevoNumero}`;
  };

  const nuevoFolio = generarFolio(folios, usuario);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnSave(true);
    setLoading(true);

    // Verifica campos requeridos
    if (
      !clienteSeleccionado ||
      !afianzadoraSeleccionada ||
      !beneficiarioSeleccionado ||
      !agenteSeleccionado ||
      !movimientoSeleccionado
    ) {
      toast.error("Rellene los campos");
      setBtnSave(false);
      setLoading(false);
      return;
    }
    let pago = "";

    if (
      movimientoSeleccionado.value === "SEGURO RC" ||
      movimientoSeleccionado.value === "AUMENTO" ||
      movimientoSeleccionado.value === "PRÓRROGA" ||
      movimientoSeleccionado.value === "MOVIMIENTO ESPECIAL P-A" ||
      movimientoSeleccionado.value === "SEGURO MAQUINARIA"
      ||
      movimientoSeleccionado.value === "CANCELACIÓN"
    ) {
      pago = "NO APLICA";
    }

    const data = {
      folio: nuevoFolio,
      fecha: fecha,
      agente: agenteSeleccionado.value,
      beneficiario: beneficiarioSeleccionado.value,
      movimiento: movimientoSeleccionado.value,
      afianzadora: afianzadoraSeleccionada.label,
      estatus: "EN REVISIÓN DE DOCUMENTOS",
      observaciones: "",
      id_cliente: clienteSeleccionado.value,
      prima_total: 0,
      estatus_pago: pago,
      tipo_proceso: "BC",
      afianzadora_id: afianzadoraSeleccionada.value

    };

    try {
      const result = await createTramite(data);

      if (result.success) {
        toast.success("Trámite guardado exitosamente.");
        navigate(0); // Recarga solo si fue exitoso
      } else {
        toast.error("Error al guardar el trámite.");
      }

      console.log(result);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast.error("Hubo un problema al guardar el trámite.");
    } finally {
      setLoading(false);
      setBtnSave(false);
    }
  };

  if (!isVisible) return null;

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50  backdrop-blur-sm">
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
    <div
      className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Nuevo Trámite</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex  flex-col gap-2 ">
            <p className="block text-gray-700">Fecha</p>
            <DatePicker
              showIcon
              toggleCalendarOnIconClick
              selected={fecha ? parse(fecha, "dd/MM/yyyy", new Date()) : null}
              onChange={(date) => {
                if (date) {
                  const formattedDate = format(date, "dd/MM/yyyy");
                  setFecha(formattedDate);
                }
              }}
              dateFormat="dd/MM/yyyy"
              className=" block w-full rounded-md border border-gray-400 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          {/* Selector de Cliente */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Cliente:</label>
            <Select
              options={clientes}
              value={clienteSeleccionado}
              onChange={setClienteSeleccionado}
              placeholder="Seleccionar cliente..."
              isClearable
            />
          </div>

          {/* Selector de Afianzadora */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Afianzadora:</label>
            <Select
              options={afianzadoras}
              value={afianzadoraSeleccionada}
              onChange={setAfianzadoraSeleccionada}
              placeholder="Seleccionar afianzadora..."
              isClearable
            />
          </div>

          {/* Selector de Beneficiario */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Beneficiario:</label>
            <Select
              options={beneficiarios}
              value={beneficiarioSeleccionado}
              onChange={setBeneficiarioSeleccionado}
              placeholder="Seleccionar beneficiario..."
              isClearable
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Selecciona un agente:
            </label>
            <Select
              options={agente}
              value={agenteSeleccionado}
              onChange={setAgente}
              placeholder="Buscar agente..."
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Selecciona un movimiento:
            </label>
            <Select
              options={movimientos}
              value={movimientoSeleccionado}
              onChange={setMovimiento}
              placeholder="Buscar movimiento..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded mr-2"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={btnSave}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default FormularioTramite;
