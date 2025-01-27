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
export function PendientesBC({ onClose, id }) {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [date, setDate] = React.useState();
  const [clientes, setClientes] = useState([]);
  const [observaciones, setObservaciones] = useState("");
  const [tieneCompromiso, setTieneCompromiso] = useState("");
  const [fecha, setFecha] = useState("");
  const [categoria, setCategoria] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTramites();
        setClientes(data);
        
        // Encontrar el cliente directamente después de obtener los datos
        const clienteEncontrado = data.find((cliente) => cliente.id_tramite === id);
        
        if (clienteEncontrado) {
          setObservaciones(clienteEncontrado.observacion_compromiso || "");
          if(clienteEncontrado.tiene_compromiso === "SI"){
            setIsSwitchOn(true)
          }
          setDate(clienteEncontrado.fecha_compromiso)

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
    if(isSwitchOn=== true){
        setTieneCompromiso("SI")
    }
    else if (isSwitchOn=== false) {
        setTieneCompromiso("NO")
    }
    const data = {
      id_tramite: id,
      tiene_compromiso: tieneCompromiso,
      observacion_compromiso: observaciones,
      fecha_compromiso: format(date, "MM/dd/yyyy"),
      categoria_compromiso: categoria,
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
      console.log(result);
      console.log(data);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast.error("Hubo un problema al guardar el trámite.");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>¿Tiene Compromisos?</DialogTitle>
        </DialogHeader>
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
                    <SelectItem value="BC-AFIANZADORA">BC-AFIANZADORA</SelectItem>
                    <SelectItem value="CLIENTES-AFIANZADORA">CLIENTES-AFIANZADORA</SelectItem>
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
            <div>
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
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
