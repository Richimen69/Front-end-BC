import React from "react";
import { Link } from "react-router-dom";
import LogoPrincipal from "../assets/logos/LogoPrincipal.svg";
function header() {
  return (
    <header className="bg-white text-primary border-b border-secondary text-[24px] font-light">
      <div className="container flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/">
            <img src={LogoPrincipal} alt="Logo" className="mx-14 w-[195px]" />
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <Link to="/tramites">
              <li className="hover:text-secondary">Trámites</li>
            </Link>
            {/* 
            <Link to="/">
              <li className="hover:text-secondary">Dashboard</li>
            </Link>
            <Link to="/reportes">
              <li className="hover:text-secondary">Generar reporte</li>
            </Link> */}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default header;
