import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { compromisos, totalCompromisos } from "@/services/kpi";
import { useEffect, useState } from "react";

function assignColor(categoria_compromiso) {
  switch (categoria_compromiso) {
    case "BC-AFIANZADORA":
      return "#FFB6C1"; // Rosa Claro
    case "CLIENTES-AFIANZADORA":
      return "#87CEFA"; // Azul Cielo
    case "CLIENTES-BC":
      return "#98FB98"; // Verde Pálido
    default:
      return "#ccc"; // Color por defecto
}
}
export default function PastelCompromisos() {
  const [Estados, setEstados] = useState([]);
  const [Total, setTotal] = useState("");

  useEffect(() => {
    const fetchEstados = async () => {
      const response = await compromisos();
      setEstados(response);
    };
    const fetchTotal = async () => {
      const response = await totalCompromisos();
      setTotal(response.total);
    };
    fetchEstados();
    fetchTotal();
  }, []);

  function calcularPorcentaje(cantidad) {
    return parseFloat(((cantidad / Total) * 100).toFixed(0));
  }
  const estados = Estados.map((item) => ({
    name: item.categoria_compromiso,
    value: calcularPorcentaje(item.total),
    color: assignColor(item.categoria_compromiso),
  }));
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Compromisos post expedicion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="text-6xl font-bold">{Total}</div>
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
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className=" cursor-pointer"
                    />
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
