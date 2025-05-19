import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DatePicker from "react-datepicker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format, set } from "date-fns";
import { fetchTramites } from "@/services/tramitesClientes";
import { updateTramite } from "@/services/tramitesClientes";
import { parse } from "date-fns";
import { useNavigate } from "react-router-dom";
import { guardarTareaCompletada, obtenerTareas } from "@/services/tareas";
export function PendientesBC({
  onClose,
  id,
  datosCliente,
  tareas,
  idMovimiento,
}) {
  const navigate = useNavigate();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [date, setDate] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [observaciones, setObservaciones] = useState("");
  const [tieneCompromiso, setTieneCompromiso] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTramites();
        setClientes(data);
        // Encontrar el cliente directamente después de obtener los datos
        const clienteEncontrado = data.find(
          (cliente) => cliente.id_tramite === id
        );

        if (clienteEncontrado) {
          setObservaciones(clienteEncontrado.observacion_compromiso || "");
          if (clienteEncontrado.tiene_compromiso === "SI") {
            setIsSwitchOn(true);
          }
          setDate(clienteEncontrado.fecha_compromiso);
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [id]);
  const obtenerFechaActual = () => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, "0");
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const anio = hoy.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };
  const guardarTarea = async () => {
    const fecha = obtenerFechaActual();

    for (let i = 0; i < idMovimiento.length; i++) {
      const tareaId = idMovimiento[i];
      const completado = tareas.includes(tareaId) ? 1 : 0;

      const datos = {
        tramite_id: id,
        tarea_id: tareaId,
        completado: completado,
        fecha_completado: fecha,
      };

      try {
        await guardarTareaCompletada(datos);
      } catch (error) {
        toast.error("Hubo un problema al guardar el trámite.");
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    await guardarTarea();
    const tieneCompromisoValue =
      datosCliente.estatusSeleccionado.value === "TERMINADO/COMPROMISO"
        ? "SI"
        : "NO";
    let estadoTramite = "";
    const estatusTerminados = [
      "TERMINADO",
      "TERMINADO/COMPROMISO",
      "TERMINADO/PENDIENTE",
    ];
    if (
      !datosCliente?.estadoTramite?.value &&
      !datosCliente?.estadoTramite?.estatus === estatusTerminados
    ) {
      toast.error("Selecciona estatus de trámite");
      return; // Detiene la ejecución si falta el estatus de trámite
    }

    if (
      datosCliente?.estatusSeleccionado?.value &&
      estatusTerminados.includes(datosCliente.estatusSeleccionado.value)
    ) {
      estadoTramite = "";
    } else {
      estadoTramite = datosCliente.estadoTramite.value;
    }

    const data = {
      id_tramite: id,
      fecha: datosCliente.fecha || "",
      beneficiario: datosCliente.beneficiario?.value || "",
      movimiento: datosCliente.movimientoSeleccionado.value || "",
      afianzadora: datosCliente.afianzadora?.value || "",
      estatus: datosCliente.estatusSeleccionado.value || "",
      observaciones: datosCliente.observaciones || "",
      fianza: datosCliente.fianza || "",
      prima_inicial: datosCliente.prima_inicial || null,
      prima_futura: datosCliente.prima_futura || null,
      prima_total: datosCliente.prima_total || 0,
      importe_total: datosCliente.importe_total || null,
      fecha_termino: datosCliente.fecha_termino || null,
      fecha_pago: datosCliente.fechaPago || null,
      estatus_pago: datosCliente.estatusPago || null,
      tiene_compromiso: tieneCompromisoValue || null,
      observacion_compromiso: observaciones || null,
      fecha_compromiso: fecha || null,
      categoria_compromiso: categoria || null,
      tipo_proceso: estadoTramite || "",
    };
    try {
      const result = await updateTramite(data);
      if (result.success) {
        navigate("/tramites");
      } else {
        toast.error("Error al guardar.");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast.error("Hubo un problema al guardar el trámite.");
    } finally {
      toast.success("Guardado exitosamente.");
      setLoading(false); // Oculta loader
    }
  };

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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {datosCliente.estatusSeleccionado.value === "TERMINADO/COMPROMISO" ? (
            <DialogTitle>¿Tiene Compromisos?</DialogTitle>
          ) : (
            <DialogTitle>¿Desea guardar los cambios?</DialogTitle>
          )}
        </DialogHeader>
        {datosCliente.estatusSeleccionado.value === "TERMINADO/COMPROMISO" && (
          <div className="grid gap-4 py-4 items-center justify-center">
            <div className="grid w-full grid-cols-4 items-center gap-4">
              <Select onValueChange={setCategoria}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>COMPROMISOS</SelectLabel>
                    <SelectItem value="BC-AFIANZADORA">
                      BC-AFIANZADORA
                    </SelectItem>
                    <SelectItem value="CLIENTES-AFIANZADORA">
                      CLIENTES-AFIANZADORA
                    </SelectItem>
                    <SelectItem value="CLIENTES-BC">CLIENTES-BC</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Observaciones</Label>
              <Textarea
                placeholder="Escribe las observaciones..."
                id="message"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </div>
            <div className="grid w-full gap-1.5 relative">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Fecha
                </Label>
                {/* DatePicker input real con padding izquierdo para que no se solape con el ícono */}
                <div className="col-span-3">
                  <DatePicker
                    calendarClassName="z-50"
                    popperPlacement="bottom-start"
                    showIcon={false}
                    toggleCalendarOnIconClick
                    selected={
                      fecha ? parse(fecha, "dd/MM/yyyy", new Date()) : null
                    }
                    onChange={(date) => {
                      if (date) {
                        const formattedDate = format(date, "dd/MM/yyyy");
                        setFecha(formattedDate);
                      }
                    }}
                    dateFormat="dd/MM/yyyy"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm text-gray-800 shadow-sm transition-all duration-150 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 hover:shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Guardar Tramite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
