import useProtectedData from "@/hooks/useProtectedData";
import Pastel from "@/components/dashboard/PastelEstadoTramites";
import Barra from "@/components/dashboard/BarraPrimaTotal";
import PastelPendientes from "@/components/dashboard/PastelPendientes";
import PastelCompromisos from "@/components/dashboard/PastelCompromisos";
import { obtenerEstados, pendientes, movimietos } from "@/services/kpi";
import { useEffect, useState } from "react";
import { Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CardDatos from "@/components/dashboard/CardDatos";
import {
  IoMdCheckmarkCircleOutline,
  IoIosAddCircleOutline,
} from "react-icons/io";
import { FaRegPauseCircle } from "react-icons/fa";
import { BsHourglassTop } from "react-icons/bs";
import { TbProgressCheck } from "react-icons/tb";
import PastelMovimientos from "@/components/dashboard/PastelMovimientos";
import { TbCancel } from "react-icons/tb";
import TableTramites from "@/components/dashboard/TableTramites";

export default function Dashboard() {
  const navigate = useNavigate();
  const [Estados, setEstados] = useState([]);
  const [pendientesBC, setPendientesBC] = useState("");
  const [tipoTabla, setTipoTabla] = useState("");
  const [movimientosData, setMovimientosData] = useState([]);
  const [mostrarTabla, setMostrarTabla] = useState(false);

  useEffect(() => {
    const fetchEstados = async () => {
      const response = await obtenerEstados();
      setEstados(response);
    };
    const fetchPendientes = async () => {
      const response = await pendientes();
      setPendientesBC(response[1].total);
    };
    const fetchMovimientos = async () => {
      const response = await movimietos();
      setMovimientosData(response);
    };
    fetchEstados();
    fetchPendientes();
    fetchMovimientos();
  }, []);
  useProtectedData();
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <button className="rounded-full p-2 hover:bg-slate-50" onClick={ () => navigate("/config")}>
          <Settings2 color="#076163" />
        </button>
      </div>
      <div className="flex flex-col items-center w-full space-y-5">
        <div className="grid md:grid-cols-4 grid-cols-1 gap-3 justify-items-center w-full">
          <Pastel />
          <PastelPendientes />
          <PastelCompromisos />
          <PastelMovimientos />
        </div>
        <div className="grid md:grid-cols-6 grid-cols-1 gap-3 justify-items-center w-full">
          <CardDatos
            icon={<IoMdCheckmarkCircleOutline />}
            tittle={"Tramites terminados"}
            data={Estados.terminado_count} //Poner cuantos son en total
          />
          <div
            className="w-full"
            onClick={() => {
              setMostrarTabla((prevState) => !prevState);
              setTipoTabla("PROCESO");
            }}
          >
            <CardDatos
              icon={<TbProgressCheck />}
              tittle={"Tramites en curso"}
              data={Estados.en_proceso_revision_count}
            />
          </div>
          <div
            className="w-full"
            onClick={() => {
              setMostrarTabla((prevState) => !prevState);
              setTipoTabla("PENDIENTE");
            }}
          >
            <CardDatos
              icon={<BsHourglassTop />}
              tittle={"Tramites pendientes"}
              data={Estados.pendiente_count}
            />
          </div>
          <div
            className="w-full"
            onClick={() => {
              setMostrarTabla((prevState) => !prevState);
              setTipoTabla("BC");
            }}
          >
            <CardDatos
              icon={<FaRegPauseCircle />}
              tittle={"Pendientes por BC"}
              data={pendientesBC}
            />
          </div>
          <CardDatos
            icon={<IoIosAddCircleOutline />}
            tittle={"Expediciones"}
            data={movimientosData.expedicion_count}
          />
          <CardDatos
            icon={<TbCancel />}
            tittle={"Cancelaciones"}
            data={movimientosData.cancelacion_count}
          />
        </div>
        {mostrarTabla ? (
          <div className="w-full">
            <TableTramites tipo={tipoTabla} />
          </div>
        ) : null}
        <Barra />
      </div>
    </div>
  );
}
