import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Toaster, toast } from "sonner";
import { estatus, agente, movimientos } from "../components/Constans";
const FormularioTramite = ({ isVisible, onClose }) => {
  const [clientes, setClientes] = useState([]);
  const [afianzadoras, setAfianzadoras] = useState([]);
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [movimientoSeleccionado, setMovimiento] = useState(null);
  const [estatusSeleccionado, setEstatus] = useState(null);
  const [agenteSeleccionado, setAgente] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [afianzadoraSeleccionada, setAfianzadoraSeleccionada] = useState(null);
  const [beneficiarioSeleccionado, setBeneficiarioSeleccionado] =
    useState(null);
  const [observaciones, setObservaciones] = useState("");
  const apiUrl = "https://bitacorabc.site/backend/";
  useEffect(() => {
    // Función para cargar datos desde diferentes endpoints
    const fetchData = async () => {
      try {
        // Cargar clientes
        const clientesResponse = await fetch(
          `${apiUrl}datos_tramites.php?table=clientes`
        );
        const clientesData = await clientesResponse.json();
        setClientes(
          clientesData.map((cliente) => ({
            value: cliente.id_cli,
            label: cliente.nombre_cli,
          }))
        );

        // Cargar afianzadoras
        const afianzadorasResponse = await fetch(
          `${apiUrl}datos_tramites.php?table=afianzadoras`
        );
        const afianzadorasData = await afianzadorasResponse.json();
        setAfianzadoras(
          afianzadorasData.map((afianzadora) => ({
            value: afianzadora.nombre_afi,
            label: afianzadora.nombre_afi,
          }))
        );

        // Cargar beneficiarios
        const beneficiariosResponse = await fetch(
          `${apiUrl}datos_tramites.php?table=beneficiarios`
        );
        const beneficiariosData = await beneficiariosResponse.json();
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
      !estatusSeleccionado ||
      !agenteSeleccionado ||
      !movimientoSeleccionado
    ) {
      toast.error("Rellene los campos");
      return;
    }

    const data = {
      folio: Math.floor(Math.random() * 9000) + 1000, // Generar o usar un folio dinámico
      fecha: new Date().toISOString().slice(0, 19).replace("T", " "), // Fecha actual en formato correcto
      agente: agenteSeleccionado.value,
      beneficiario: beneficiarioSeleccionado.value,
      movimiento: movimientoSeleccionado.value,
      afianzadora: afianzadoraSeleccionada.value,
      estatus: estatusSeleccionado.value,
      observaciones: observaciones,
      id_cliente: clienteSeleccionado.value,
    };

    try {
      const response = await fetch(`${apiUrl}tramites.php`, {
        method: "POST",
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
            <label className="block text-gray-700 mb-2">Estatus:</label>
            <Select
              options={estatus}
              value={estatusSeleccionado}
              onChange={setEstatus}
              placeholder="Buscar estatus..."
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
