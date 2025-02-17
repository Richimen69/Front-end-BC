import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { obtenerEstados } from "@/services/kpi";
import { useEffect, useState } from "react";

const estados = [
  { name: "En proceso", value: 30, color: "#FFA500" }, // Naranja
  { name: "Pendiente", value: 60, color: "#FFFF00" }, // Amarillo
  { name: "No procede", value: 10, color: "#FF0000" }, // Rojo
  { name: "Terminado", value: 10, color: "#008000" }, // Verde
  { name: "En revisión de documentos", value: 10, color: "#0000FF" }, // Azul
];

export default function Pastel() {
  const [Estados, setEstados] = useState("");

  useEffect(() => {
    const fetchEstados = async () => {
      const response = await obtenerEstados();
      setEstados(response);
      console.log(response);
    };
    fetchEstados();
  }, []);

  function calcularPorcentaje(cantidad, total) {
    return parseFloat(((cantidad / total) * 100).toFixed(2));
  }
  const estados = [
    { name: "En proceso", value: calcularPorcentaje(Estados.en_proceso_revision_count, Estados.total_tramites), color: "#FFA500" }, // Naranja
    { name: "Pendiente", value: calcularPorcentaje(Estados.pendiente_count, Estados.total_tramites), color: "#FFFF00" }, // Amarillo
    { name: "No procede", value: calcularPorcentaje(Estados.no_procede_count, Estados.total_tramites), color: "#FF0000" }, // Rojo
    { name: "Terminado", value: calcularPorcentaje(Estados.terminado_count, Estados.total_tramites), color: "#008000" }, // Verde
    { name: "En revisión de documentos", value: calcularPorcentaje(Estados.revision_documentos_count, Estados.total_tramites), color: "#0000FF" }, // Azul
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
