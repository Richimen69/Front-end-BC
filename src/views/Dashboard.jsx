import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { StatCard } from "@/components/stat-card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { PieChart, Pie, Cell } from "recharts"

const approvalData = [
  { name: "Ene", value1: 40, value2: 30, value3: 45, value4: 35 },
  { name: "Feb", value1: 35, value2: 45, value3: 40, value4: 40 },
  { name: "Mar", value1: 45, value2: 35, value3: 35, value4: 45 },
  { name: "Abr", value1: 40, value2: 40, value3: 45, value4: 35 },
  { name: "May", value1: 35, value2: 45, value3: 40, value4: 40 },
]

const donutData = [
  { name: "Aprobadas", value: 30, color: "#C084FC" },
  { name: "Tráfico", value: 60, color: "#3B82F6" },
  { name: "Solicitudes", value: 10, color: "#FB923C" },
]

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Fianzas diarias */}
        <Card className="relative overflow-hidden border-l-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Fianzas diarias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">182</div>
            <div className="flex items-center text-xs text-green-600 mt-2">
              8.5% Mejor que la semana pasada
            </div>
          </CardContent>
        </Card>

        {/* Órdenes totales */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Órdenes totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">54</div>
            <div className="flex items-center text-xs text-green-600 mt-2">
              3.5% Mejor que la semana pasada
            </div>
          </CardContent>
        </Card>

        {/* Pendientes */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">7</div>
            <div className="flex items-center text-xs text-green-600 mt-2">
              0.5% Mejor que la semana pasada
            </div>
          </CardContent>
        </Card>

        {/* Venta lograda */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Venta lograda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">38</div>
            <div className="flex items-center text-xs text-green-600 mt-2">
              9.2% Mejor que la semana pasada
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Detalles de Fianzas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-700">Detalles de Fianzas</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="text-5xl font-bold">182</div>
              <div className="space-y-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#C084FC] mr-2" />
                  <span className="text-sm text-gray-600">Aprobadas</span>
                  <span className="ml-2 text-sm font-semibold">30%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#3B82F6] mr-2" />
                  <span className="text-sm text-gray-600">Tráfico</span>
                  <span className="ml-2 text-sm font-semibold">60%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#FB923C] mr-2" />
                  <span className="text-sm text-gray-600">Solicitudes</span>
                  <span className="ml-2 text-sm font-semibold">10%</span>
                </div>
              </div>
            </div>
            <div className="w-[200px] h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Índice de aprobación */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-700">Índice de aprobación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={approvalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Line type="monotone" dataKey="value1" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="value2" stroke="#C084FC" strokeWidth={2} />
                  <Line type="monotone" dataKey="value3" stroke="#FB923C" strokeWidth={2} />
                  <Line type="monotone" dataKey="value4" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="ventas" className="space-y-4 mt-6">
        <TabsList>
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="IT">IT</TabsTrigger>
        </TabsList>
        <TabsContent value="ventas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Prima Anual Total" value="$1,234,567" />
            <StatCard title="Prima vs Presupuesto" value="95%" description="Anual" />
            <StatCard title="Cobranza Total" value="$987,654" />
            <StatCard title="Pendientes" value="23" description="C > A" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Prima Anual por Afianzadora</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Aquí iría un gráfico de barras o pastel */}
                <p>Gráfico de distribución de prima por afianzadora</p>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Cobranza Detallada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Fiado:</span>
                    <span className="font-bold">$500,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prima neta:</span>
                    <span className="font-bold">$400,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Importe total:</span>
                    <span className="font-bold">$987,654</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="movimientos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos Mensuales</CardTitle>
              <CardDescription>Resumen de todos los movimientos del mes actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Expedición" value="150" />
                <StatCard title="Terminados" value="75" />
                <StatCard title="En proceso" value="30" />
                <StatCard title="Cancelaciones" value="5" />
                <StatCard title="Prorroga" value="10" />
                <StatCard title="Aumento" value="20" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="IT" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos Mensuales</CardTitle>
              <CardDescription>Resumen de todos los movimientos del mes actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Expedición" value="150" />
                <StatCard title="Terminados" value="75" />
                <StatCard title="En proceso" value="30" />
                <StatCard title="Cancelaciones" value="5" />
                <StatCard title="Prorroga" value="10" />
                <StatCard title="Aumento" value="20" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

