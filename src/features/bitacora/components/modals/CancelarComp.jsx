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
import DatePicker from "react-datepicker";
import { updateTramite } from "@/features/bitacora/services/tramitesClientes";
import { useNavigate } from "react-router-dom";
import { parse } from "date-fns";

export default function CancelarComp({ onClose, id_tramite }) {
  const [date, setDate] = React.useState(null);
  const [user, setUser] = useState("");
  const [fecha, setFecha] = useState(null);

  const navigate = useNavigate();
  const terminarCompromiso = async () => {
    const fechaCompromiso = date ? format(date, "MM/dd/yyyy") : null;
    const data = {
      id_tramite: id_tramite,
      estatus: "TERMINADO",
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
