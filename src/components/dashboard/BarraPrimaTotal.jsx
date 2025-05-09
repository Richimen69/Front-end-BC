import { Bar, BarChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { obtenerTotalAfianzadoras, primaTotal } from "@/services/kpi";
export default function Barra() {
  const [afianzadoras, setAfianzadoras] = useState([]);
  const [primas, setPrimas] = useState([]);
  const [primaTotales, setPrimaTotal] = useState("");
  const [mesSeleccionado, setMesSeleccionado] = useState(""); // YYYY-MM
  const [totalGeneral, setTotalGeneral] = useState(0);
  const handleMesChange = (e) => {
    const fecha = e.target.value; // "2025-02" o ""

    if (!fecha) {
      setMesSeleccionado(""); // Si se borra el valor, limpiar el estado
      return;
    }

    const [anio, mes] = fecha.split("-");
    const mesFormateado = `${mes}-${anio}`; // Convertir a "MM-YYYY"
    setMesSeleccionado(mesFormateado); // Actualizar el mes seleccionado
  };

  useEffect(() => {
    const obtenerAfianzadoras = async () => {
      const response = await obtenerTotalAfianzadoras(mesSeleccionado);
      setAfianzadoras(response);
    };
    const obtenerPrima = async () => {
      const response = await primaTotal();
      setPrimaTotal(response);
    };
    obtenerAfianzadoras();
    obtenerPrima();
  }, [mesSeleccionado]);

  useEffect(() => {
    // Filtra los registros sin fecha
    const sinFecha = afianzadoras.filter((a) => !a.fecha);

    // Agrupa y suma por afianzadora
    const agrupadas = sinFecha.reduce((acc, curr) => {
      const nombre = curr.afianzadora;
      const total = parseFloat(curr.total_prima);

      if (!acc[nombre]) {
        acc[nombre] = total;
      } else {
        acc[nombre] += total;
      }

      return acc;
    }, {});

    // Suma total de primas
    const totalPrima = Object.values(agrupadas).reduce(
      (acc, val) => acc + val,
      0
    );

    // Construye el arreglo de objetos con estructura para el gráfico
    const nuevasPrimas = Object.entries(agrupadas).map(
      ([afianzadora, amount]) => {
        let meta;
        const porcentaje = ((amount / totalPrima) * 100).toFixed(2);
        if (mesSeleccionado) {
          meta = 500000;
        } else {
          meta = 6000000;
        }

        return {
          name: afianzadora,
          value: porcentaje,
          color: "hsl(var(--info))",
          amount,
          porcentajeMeta: ((amount / meta) * 100).toFixed(1),
          restante: meta - amount,
          meta,
        };
      }
    );
    const totalGeneral = afianzadoras.reduce(
      (acc, a) => acc + parseFloat(a.total_prima),
      0
    );
    setTotalGeneral(totalGeneral);
    setPrimas(nuevasPrimas);
    console.log(nuevasPrimas)
  }, [afianzadoras]);

  return (
    <Card className="w-full border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-800 md:text-2xl">
              Prima total por afianzadora
            </CardTitle>
          </div>
          <div className="mt-4 flex items-center md:mt-0 space-x-4">
            <input
              type="month"
              value={mesSeleccionado.split("-").reverse().join("-")}
              onChange={handleMesChange}
              className="border text-sm rounded-md p-2 text-gray-600"
            />
            <span className="text-sm font-medium text-gray-500">
              Actualizado: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <div>
            <p className="text-sm font-medium text-blue-700">Prima Total</p>
            <div className="text-4xl font-bold text-gray-900">
              ${totalGeneral.toLocaleString("en-US")}
            </div>
          </div>

          <div className="w-full md:w-1/6 h-40 mt-4 md:mt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={primas}>
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {primas.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Bar>
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    padding: "8px 12px",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          {primas.map((item, index) => {
            return (
              <div
                key={`${item.name}-${index}`}
                className="p-4 rounded-lg border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-gray-800">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex flex-col items-start md:items-end mt-2 md:mt-0">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-900">
                        ${item.amount.toLocaleString("en-US")}
                      </span>
                      {item.amount > 0 && (
                        <div className="ml-2 flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                          {item.porcentajeMeta}%
                        </div>
                      )}
                    </div>
                    {item.amount < item.meta && (
                      <span className="text-xs text-red-500">
                        Faltan: ${item.restante.toLocaleString("en-US")}
                      </span>
                    )}
                    {item.amount >= item.meta && (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        ¡Meta alcanzada!
                      </span>
                    )}
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Avance</span>
                    <span className="text-xs font-medium text-gray-700">
                      {item.porcentajeMeta}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        item.amount >= item.meta
                          ? "bg-emerald-500"
                          : item.porcentajeMeta > 50
                          ? "bg-blue-500"
                          : item.porcentajeMeta > 10
                          ? "bg-blue-400"
                          : "bg-blue-300"
                      }`}
                      style={{
                        width: `${Math.min(
                          (item.amount / item.meta) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
