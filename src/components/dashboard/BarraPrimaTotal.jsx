import { Bar, BarChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { obtenerTotalAfianzadoras, primaTotal } from "@/services/kpi";
export default function Barra() {
  const [afianzadoras, setAfianzadoras] = useState([]);
  const [primas, setPrimas] = useState([]);
  const [primaTotales, setPrimaTotal] = useState("");
  useEffect(() => {
    const obtenerAfianzadoras = async () => {
      const response = await obtenerTotalAfianzadoras();
      setAfianzadoras(response);
    };
    const obtenerPrima = async () => {
      const response = await primaTotal();
      setPrimaTotal(response);
    };
    obtenerAfianzadoras();
    obtenerPrima();
  }, []);

  useEffect(() => {
    const totalPrima = afianzadoras.reduce(
      (total, afianzadora) => total + parseFloat(afianzadora.total_prima),
      0
    );
    const nuevasPrimas = afianzadoras.map((afianzadora) => ({
      name: afianzadora.afianzadora,
      value: ((parseFloat(afianzadora.total_prima) / totalPrima) * 100).toFixed(
        2
      ),
      color: "hsl(var(--info))",
      amount: parseFloat(afianzadora.total_prima),
    }));
    setPrimas(nuevasPrimas);
  }, [afianzadoras]);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Prima total por afianzadora</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="text-4xl font-bold">${primaTotales.total_primas}</div>
          <div className="w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={primas}>
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {primas.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="cursor-pointer"
                    />
                  ))}
                </Bar>
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "6px",
                    border: "none",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-3">
          {primas.map((item) => (
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
              <div className="flex gap-4">
                <span className="font-semibold">${item.amount}</span>
                <span className="font-semibold text-muted-foreground">
                  {item.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
