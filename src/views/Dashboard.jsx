import useProtectedData from "@/hooks/useProtectedData";
import Pastel from "@/components/dashboard/PastelEstadoTramites";
import Barra from "@/components/dashboard/BarraPrimaTotal";
import PastelPendientes from "@/components/dashboard/PastelPendientes";
export default function Dashboard() {
  useProtectedData();
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 c">Dashboard</h1>
      <div className="grid grid-cols-5">
        <Pastel />
        <PastelPendientes />
      </div>
      <Barra />
    </div>
  );
}
