import fetchApi from "@/shared/services/api";

export const obtenerClientes = async () => {
  return await fetchApi(`/clientes/clientes.php`, {
    method: "GET",
    body: JSON.stringify(),
  });
};

export const obtenerReferidos = async (id) => {
  return await fetchApi(`/clientes/obtener_referidos.php?id_cli=${id}`, {
    method: "GET",
    body: JSON.stringify(),
  });
};

export const addReferido = async (datos) => {
  return await fetchApi(`/clientes/add.php`, {
    method: "POST",
    body: JSON.stringify(datos),
  });
};

