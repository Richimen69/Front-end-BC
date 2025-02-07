import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateTramites } from "@/services/rpp";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
export default function AprobarTramite({ onClose, id_tramite }) {
  const navigate = useNavigate();
  const aprobar = async () => {
    try {
      if (!Array.isArray(id_tramite) || id_tramite.length === 0) {
        console.error("Error: id_tramite no es un array válido o está vacío");
        return;
      }

      for (let i = 0; i < id_tramite.length; i++) {
        const data = {
          id: id_tramite[i],
          estatus: "EN ESPERA DE APROBACION",
        };
        const response = await updateTramites(data);
        if (response.success) {
          toast.success("Guardado exitosamente.");
          setTimeout(() => {
            navigate(0);
          }, 1500);
        } else {
          toast.error("Error");
        }
      }
    } catch (error) {
      console.error("Error", error);
    }
  };
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enviar certificado</DialogTitle>
          <DialogDescription>¿Desea guardar cambios?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              aprobar();
            }}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
