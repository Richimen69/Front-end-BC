import fetchApi from "./api";

export const obtenerClientes = async () => {
  return await fetchApi(`clientes.php`, {
    method: "GET",
    body: JSON.stringify(),
  });
};