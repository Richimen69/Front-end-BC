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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function CancelarComp({ onClose, id_tramite }) {
  const [date, setDate] = React.useState(null);
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const terminarCompromiso = async () => {
    const fechaCompromiso = date ? format(date, "MM/dd/yyyy") : null;
    const data = {
      id_tramite: id_tramite,
      tiene_compromiso: "NO",
      compromiso_terminado: "SI",
      nombre_compromiso: user,
      fecha_termino_compromiso: fechaCompromiso,
    };
    try {
      const result = await updateTramite(data);
      if (result.success) {
        toast.success("Compromiso guardado exitosamente.");
        setTimeout(() => {
          navigate(0);
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
          <DialogTitle>Terminar Compromiso</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              onChange={(e) => setUser(e.target.value)}
              placeholder="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Fecha de compromiso</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="fecha"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left h-12 font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date
                    ? format(date, "PPP", { locale: es })
                    : "Selecciona una fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              terminarCompromiso();
            }}
          >
            Aceptar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
