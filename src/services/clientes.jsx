import fetchApi from "./api";

export const obtenerClientes = async () => {
  return await fetchApi(`/clientes/clientes.php`, {
    method: "GET",
    body: JSON.stringify(),
  });
};

export const addCliente = async (datos) => {
  return await fetchApi(`/clientes/add.php`, {
    method: "POST",
    body: JSON.stringify(datos),
  });
};