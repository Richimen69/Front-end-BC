import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DatePicker from "react-datepicker";
import { CiCalendarDate } from "react-icons/ci";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { format, set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchTramites } from "@/services/tramitesClientes";
import { updateTramite } from "@/services/tramitesClientes";
import { parse } from "date-fns";
import { useNavigate } from "react-router-dom";

export function PendientesBC({ onClose, id, datosCliente }) {
  const navigate = useNavigate();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [date, setDate] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [observaciones, setObservaciones] = useState("");
  const [tieneCompromiso, setTieneCompromiso] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState(null);

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

  const clienteEncontrado = clientes.find(
    (cliente) => cliente.id_tramite === id
  );

  const handleSubmit = async () => {
    const tieneCompromisoValue =
      datosCliente.estatusSeleccionado.value === "TERMINADO/COMPROMISO"
        ? "SI"
        : "NO";
    let estadoTramite;
    if (
      datosCliente.estatusSeleccionado.value === "TERMINADO" ||
      datosCliente.estatusSeleccionado.value === "TERMINADO/COMPROMISO"
    ) {
      estadoTramite = "";
    } else {
      estadoTramite = datosCliente.estadoTramite.value;
    }
    const data = {
      id_tramite: id,
      movimiento: datosCliente.movimientoSeleccionado.value || "",
      afianzadora: datosCliente.afianzadora.value || "",
      estatus: datosCliente.estatusSeleccionado.value || "",
      observaciones: datosCliente.observaciones || "",
      fianza: datosCliente.fianza || "",
      prima_inicial: datosCliente.prima_inicial || null,
      prima_futura: datosCliente.prima_futura || null,
      prima_total: datosCliente.prima_total || 0,
      importe_total: datosCliente.importe_total || null,
      fecha_termino: datosCliente.fecha_termino || null,
      fecha_pago: datosCliente.fechaPago || null,
      estatus_pago: datosCliente.estatusPago,
      tiene_compromiso: tieneCompromisoValue,
      observacion_compromiso: observaciones,
      fecha_compromiso: fecha,
      categoria_compromiso: categoria,
      tipo_proceso: estadoTramite,
    };
    try {
      const result = await updateTramite(data);
      if (result.success) {
        toast.success("Guardado exitosamente.");
        setTimeout(() => {
          navigate("/tramites");
        }, 1500);
      } else {
        toast.error("Error al guardar.");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast.error("Hubo un problema al guardar el trámite.");
    }
  };

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
          <Button
            type="submit"
            onClick={() => {
              handleSubmit(); // Cierra el diálogo al guardar cambios
            }}
          >
            Guardar Tramite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
