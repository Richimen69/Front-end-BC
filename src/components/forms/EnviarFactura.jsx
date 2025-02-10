import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MdOutlineWifiProtectedSetup } from "react-icons/md";
import { IconContext } from "react-icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { uploadArchivo } from "@/services/rpp";
import { useNavigate } from "react-router-dom";
import { updateTramites } from "@/services/rpp";
export default function EnviarFactura({ onClose, id_tramite, costo }) {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [file, setFile] = useState(null);
  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < costo.length; i++) {
      sum += parseFloat(costo[i]) || 0;
    }
    setTotal(sum);
  }, [costo]);

  const actualizarTramite = async () => {
    if (!file) {
      toast.error("Selecciona un archivo");
      return;
    }
    handleUpload();
    console.log(file);
    const data = {
      id: id_tramite[0],
      estatus: "ESPERANDO PAGO",
      url_factura: file.name,
    };

    try {
      const result = await updateTramites(data);
      if (result.message) {
        toast.success("Trámite guardado exitosamente.");
      } else {
        toast.error("Error al guardar el trámite.");
      }
    } catch (error) {
      toast.error("Hubo un problema al guardar el trámite.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Selecciona un archivo");
      return null;
    }

    try {
      const response = await uploadArchivo(file); // Asumiendo que esta función maneja la subida
      if (response.message) {
        console.log("Archivo subido correctamente", response);
        return response;
      } else {
        console.log(response.error);
        return null;
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      toast.error("Hubo un problema al subir el archivo.");
      return null;
    }
  };
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enviar Factura</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Total a pagar
            </Label>
            <Label htmlFor="name" className="text-right">
              ${total} MXN
            </Label>
          </div>
          <div className="grid items-center gap-1.5">
            <Label htmlFor="picture">Factura</Label>
            <Input id="picture" type="file" onChange={handleFileChange} />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              actualizarTramite();
            }}
          >
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
