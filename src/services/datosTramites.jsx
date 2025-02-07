import fetchApi from "./api";

export const fetchClientes = async () => {
  return await fetchApi(`datos_tramites.php?table=clientes`);
};

export const fetchAfianzadoras = async () => {
  return await fetchApi(`datos_tramites.php?table=afianzadoras`);
};

export const fetchBeficiarios = async () => {
  return await fetchApi(`datos_tramites.php?table=beneficiarios`);
};


