import React from "react";
import { Link } from "react-router-dom";
import LogoPrincipal from "@/assets/logos/LogoPrincipal.svg";
import { useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { MdOutlineLogout } from "react-icons/md";
function header() {
  // Para actualizar el estado del contexto
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminar el token y el usuario del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirigir al login
    navigate("/login");
  };
  return (
    <header className="bg-white text-primary border-b border-secondary text-[24px] font-light w-full">
      <div className="flex justify-between items-center px-6">
        <div className="text-xl font-bold">
          <Link to="/">
            <img src={LogoPrincipal} alt="Logo" className="w-[195px]" />
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <Link to="/">
              <li className="hover:text-secondary">Dashboard</li>
            </Link>
            <Link to="/tramites">
              <li className="hover:text-secondary">Trámites</li>
            </Link>
            <Link to="/tramites">
              <li className="hover:text-secondary">Clientes</li>
            </Link>
            <Link to="/rpp">
              <li className="hover:text-secondary">RPP</li>
            </Link>
            {/* 
            <Link to="/reportes">
              <li className="hover:text-secondary">Generar reporte</li>
            </Link> */}
            <li>
              <button
                className="hover:opacity-45 transition ease-in-out  hover:-translate-y-1 hover:scale-110 duration-300"
                onClick={handleLogout}
              >
                <IconContext.Provider
                  value={{
                    color: "#076163",
                    className: "global-class-name",
                    size: "1.5em",
                  }}
                >
                  <MdOutlineLogout />
                </IconContext.Provider>
              </button>
            </li>
            <li>
              
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default header;
