import fetchApi from "./api";

export const createTramite = async (tramiteData) => {
  return await fetchApi('tramites.php', {
    method: 'POST',
    body: JSON.stringify(tramiteData),
  });
};
export const updateTramite = async (tramiteData) => {
  return await fetchApi(`tramites.php`, {
    method: "PUT",
    body: JSON.stringify(tramiteData),
  });
};
export const buscarTramitePorFolio = async (folio) => {
  return await fetchApi(`tramites.php?folio=${folio}`);
};

export const fetchTramites = async () => {
  return await fetchApi("tramites.php");
};
