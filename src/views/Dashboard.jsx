import React from 'react'
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
      const fetchProtectedData = async () => {
        const token = localStorage.getItem("token");
  
        if (!token) {
          // Si no hay token, redirigir al login
          navigate("/login");
          return;
        }
  
        try {
          const response = await fetch("https://bitacorabc.site/backend/ruta_protegida.php", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
  
          const data = await response.json();
  
          if (data.status === "success") {
            console.log("Acceso a datos protegidos:", data);
          } else {
            console.error("Error de autenticación:", data.message);
            navigate("/login"); // Redirigir al login si el token no es válido
          }
        } catch (error) {
          console.error("Error al acceder a la ruta protegida:", error);
        }
      };
  
      fetchProtectedData();
    }, [navigate]);
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard