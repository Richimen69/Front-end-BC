const baseURL = "https://bitacorabc.site/Backend_RPP/";

const fetchApi = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(baseURL + endpoint, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error en la solicitud");
  }

  return response.json();
};

export const obtenerTramites = async () => {
    return await fetchApi(`tramites.php`, {
      method: "GET",
      body: JSON.stringify(),
    });
  };