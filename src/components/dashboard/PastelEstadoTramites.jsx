import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { obtenerEstados } from "@/services/kpi";
import { useEffect, useState } from "react";

export default function Pastel() {
  const [Estados, setEstados] = useState("");

  useEffect(() => {
    const fetchEstados = async () => {
      const response = await obtenerEstados();
      setEstados(response);
    };
    fetchEstados();
  }, []);

  function calcularPorcentaje(cantidad, total) {
    return parseFloat(((cantidad / total) * 100).toFixed(0));
  }
  const estados = [
    {
      name: "En proceso",
      value: calcularPorcentaje(
        Estados.en_proceso_revision_count,
        Estados.total_tramites
      ),
      color: "#FDE68A",
    }, // Amarillo pastel
    {
      name: "Pendiente",
      value: calcularPorcentaje(
        Estados.pendiente_count,
        Estados.total_tramites
      ),
      color: "#BFDBFE",
    }, // Azul pastel
    {
      name: "No procede",
      value: calcularPorcentaje(
        Estados.no_procede_count,
        Estados.total_tramites
      ),
      color: "#FCA5A5",
    }, // Rojo pastel
    {
      name: "Terminado",
      value: calcularPorcentaje(
        Estados.terminado_count,
        Estados.total_tramites
      ),
      color: "#A7F3D0",
    }, // Verde pastel
    {
      name: "En revisión de documentos",
      value: calcularPorcentaje(
        Estados.revision_documentos_count,
        Estados.total_tramites
      ),
      color: "#DDD6FE",
    }, // Púrpura pastel
  ];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Estados de Tramites</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="text-6xl font-bold">{Estados.total_tramites}</div>
          <div className="w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={estados}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {estados.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color}  className=" cursor-pointer"/>
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "6px",
                    border: "none",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-3">
          {estados.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name}
                </span>
              </div>
              <span className="font-semibold">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
