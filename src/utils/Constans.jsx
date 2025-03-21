export const movimientos = [
  { value: "ACTUALIZACIÓN", label: "ACTUALIZACIÓN" },
  { value: "ALTA", label: "ALTA" },
  { value: "ANUENCIA", label: "ANUENCIA" },
  { value: "ANULACIÓN", label: "ANULACIÓN" },
  { value: "AUMENTO", label: "AUMENTO" },
  { value: "BAJA O.S.", label: "BAJA O.S." },
  { value: "CAMBIO DE AGENTE", label: "CAMBIO DE AGENTE" },
  { value: "CANCELACIÓN Y DEV. DEP. PREND.", label: "CANCELACIÓN Y DEV. DEP. PREND." },
  { value: "CANCELACIÓN", label: "CANCELACIÓN" },
  { value: "CARTA LÍNEA AFIANZAMIENTO", label: "CARTA LÍNEA AFIANZAMIENTO" },
  { value: "CARTA TILDACIÓN", label: "CARTA TILDACIÓN" },
  { value: "CORRECCIÓN", label: "CORRECCIÓN" },
  { value: "COTIZACIÓN", label: "COTIZACIÓN" },
  { value: "DEV. DEP. EQUIVOCADO", label: "DEV. DEP. EQUIVOCADO" },
  { value: "DEV. NOTAS DE CRÉDITO", label: "DEV. NOTAS DE CRÉDITO" },
  { value: "DEVOLUCIÓN DEP. PREND.", label: "DEVOLUCIÓN DEP. PREND." },
  { value: "DISMINUCIÓN", label: "DISMINUCIÓN" },
  { value: "ENDOSO", label: "ENDOSO" },
  { value: "ENDOSO POR DIFERIMIENTO DE PLAZO", label: "ENDOSO POR DIFERIMIENTO DE PLAZO" },
  { value: "EXPEDICIÓN CON DEP. PRENDARIO", label: "EXPEDICIÓN CON DEP. PRENDARIO" },
  { value: "EXPEDICIÓN", label: "EXPEDICIÓN" },
  { value: "PRÓRROGA", label: "PRÓRROGA" },
  { value: "SEGUIMIENTO", label: "SEGUIMIENTO" },
  { value: "SEGURO MAQUINARIA", label: "SEGURO MAQUINARIA" },
  { value: "SEGURO RC", label: "SEGURO RC" }
];
  
  export const estatus = [
    { value: "EN REVISIÓN DE DOCUMENTOS", label: "EN REVISIÓN DE DOCUMENTOS" },
    { value: "EN PROCESO", label: "EN PROCESO" },
    { value: "EN REVISIÓN DE PREVIAS", label: "EN REVISIÓN DE PREVIAS" },
    { value: "TERMINADO", label: "TERMINADO" },
    { value: "NO PROCEDE", label: "NO PROCEDE" },
    { value: "PENDIENTE", label: "PENDIENTE" },
  ];

  export const estadoTramite = [
    { value: "AFIANZADORA", label: "AFIANZADORA" },
    { value: "BC", label: "BC" },
    { value: "FIADO", label: "FIADO" },
  ];

  export const agente = [
    { value: "RBG", label: "RBG" },
    { value: "BPS", label: "BPS" },
    { value: "LDP", label: "LDP" },
    { value: "RBG (GUSTAVO)", label: "RBG (GUSTAVO)" },
    { value: "RBG (RUBEN)", label: "RBG (RUBEN)" },
  ];

  export const estatus_pagos = [
    { value: "SE MANDÓ RECIBO", label: "SE MANDÓ RECIBO" },
    { value: "NO PAGADA", label: "NO PAGADA" },
    { value: "PENDIENTE", label: "PENDIENTE" },
  ];

  export const statusStyles = {
    "NUEVO": "bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-base font-semibold",
    "EN PROCESO": "bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-base font-semibold",
    "EN REVISION": "bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-base font-semibold",
    "CORRECCION INTERNA": "bg-red-100 text-red-600 px-3 py-1 rounded-full text-base font-semibold",
    "EN ESPERA DE APROBACION": "bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-base font-semibold",
    "CORRECCION": "bg-red-200 text-red-700 px-3 py-1 rounded-full text-base font-semibold",
    "ESPERANDO PAGO":
    "bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-base font-semibold",
    "APROBADO": "bg-lime-100 text-lime-600 px-3 py-1 rounded-full text-base font-semibold",
    "FACTURA ENVIADA": "bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-base font-semibold",
    "FINALIZADO": "bg-green-100 text-green-600 px-3 py-1 rounded-full text-base font-semibold",
    "CANCELADO": "bg-red-600 text-red-100 px-3 py-1 rounded-full text-base font-semibold",
  };
  export const estatusRPP = [
    {value: "EN ESPERA DE APROBACION"},
    {value: "FINALIZADO"},
    {value: "EN PROCESO"},
    {value: "NUEVO"},
    {value: "EN REVISION"},
    {value: "APROBADO"},
    {value: "CORRECCION"},
    {value: "EN ESPERA DE PAGO"},
    {value: "CANCELADO"},
  
  ]