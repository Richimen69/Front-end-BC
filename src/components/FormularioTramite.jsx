import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Toaster, toast } from "sonner";
import { agente, movimientos } from "../components/Constans";
import {
  fetchClientes,
  fetchAfianzadoras,
  fetchBeficiarios,
} from "../services/datosTramites";
import { createTramite } from "../services/tramitesClientes";
import { format } from "date-fns";
const FormularioTramite = ({ isVisible, onClose }) => {
  const storedUser = localStorage.getItem("user");
  const [clientes, setClientes] = useState([]);
  const [afianzadoras, setAfianzadoras] = useState([]);
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [movimientoSeleccionado, setMovimiento] = useState(null);
  const [agenteSeleccionado, setAgente] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [afianzadoraSeleccionada, setAfianzadoraSeleccionada] = useState(null);
  const [beneficiarioSeleccionado, setBeneficiarioSeleccionado] =
    useState(null);
  const [usuario, setUsuario] = useState("")
  useEffect(() => {
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const formattedUser = user.usuario_usu.charAt(0).toUpperCase(); 
        setUsuario(formattedUser);
      } catch (error) {
        console.error("Error al analizar el usuario desde localStorage:", error);
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

        // Cargar afianzadoras
        const afianzadorasData = await fetchAfianzadoras();
        setAfianzadoras(
          afianzadorasData.map((afianzadora) => ({
            value: afianzadora.nombre_afi,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si los campos requeridos están completos
    if (
      !clienteSeleccionado ||
      !afianzadoraSeleccionada ||
      !beneficiarioSeleccionado ||
      !agenteSeleccionado ||
      !movimientoSeleccionado
    ) {
      toast.error("Rellene los campos");
      return;
    }
    const fechaFormateada = format(new Date(), "dd/MM/yyyy HH:mm");
    const data = {
      folio: `${usuario}${"-"}${Math.floor(Math.random() * 9000) + 1000}`,
      fecha: `${fechaFormateada}`,
      agente: agenteSeleccionado.value,
      beneficiario: beneficiarioSeleccionado.value,
      movimiento: movimientoSeleccionado.value,
      afianzadora: afianzadoraSeleccionada.value,
      estatus: "EN REVISIÓN DE DOCUMENTOS",
      observaciones: "",
      id_cliente: clienteSeleccionado.value,
    };

    try {
      const result = await createTramite(data);
      if (result.success) {
        toast.success("Trámite guardado exitosamente.");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.error("Error al guardar el trámite.");
      }
      console.log(result);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast.error("Hubo un problema al guardar el trámite.");
    }
  };

  if (!isVisible) return null;

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
