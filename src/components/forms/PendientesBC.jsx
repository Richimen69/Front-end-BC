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
import { useNavigate } from "react-router-dom";

export function PendientesBC({ onClose, id, datosCliente }) {
  const navigate = useNavigate();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [date, setDate] = React.useState(null);
  const [clientes, setClientes] = useState([]);
  const [observaciones, setObservaciones] = useState("");
  const [tieneCompromiso, setTieneCompromiso] = useState("");
  const [categoria, setCategoria] = useState("");

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
    const tieneCompromisoValue = isSwitchOn ? "SI" : "NO";

    const fechaCompromiso = date ? format(date, "MM/dd/yyyy") : null;
    const data = {
      id_tramite: id,
      estatus: datosCliente.estatusSeleccionado.value || "",
      observaciones: datosCliente.observaciones || "",
      fianza: datosCliente.fianza || "",
      prima_inicial: datosCliente.prima_inicial || null,
      prima_futura: datosCliente.prima_futura || null,
      prima_total: datosCliente.prima_total || null,
      importe_total: datosCliente.importe_total || null,
      fecha_termino: datosCliente.fecha_termino || null,
      fecha_pago: datosCliente.fechaPago || null,
      estatus_pago: datosCliente.estatusPago,
      tiene_compromiso: tieneCompromisoValue,
      observacion_compromiso: observaciones,
      fecha_compromiso: fechaCompromiso,
      categoria_compromiso: categoria,
      tipo_proceso: datosCliente.estadoTramite.value,
    };
    try {
      const result = await updateTramite(data);
      if (result.success) {
        toast.success("Compromiso guardado exitosamente.");
        setTimeout(() => {
          navigate("/tramites");
        }, 1500);
      } else {
        toast.error("Error al guardar el Compromiso.");
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
          {datosCliente.estatusSeleccionado.value === "TERMINADO" ? (
            <DialogTitle>¿Tiene Compromisos?</DialogTitle>
          ) : (
            <DialogTitle>¿Desea guardar los cambios?</DialogTitle>
          )}
        </DialogHeader>
        {datosCliente.estatusSeleccionado.value === "TERMINADO" ? (
          <div className="flex items-center space-x-2">
            <Switch
              id="airplane-mode"
              checked={isSwitchOn}
              onCheckedChange={setIsSwitchOn}
            />
            <Label htmlFor="airplane-mode" className="text-left">
              {isSwitchOn ? "Sí" : "No"}
            </Label>
          </div>
        ) : null}
        {isSwitchOn && (
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
            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "dd/MM/yyyy", { locale: es }) // Formatea la fecha en formato español
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
