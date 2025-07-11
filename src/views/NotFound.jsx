import React from "react";

function NotFound() {
  return (
    <div className="grid h-screen place-content-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200">404</h1>

        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Uh-oh!
        </p>

        <p className="mt-4 text-gray-500">Pagina no encontrada.</p>

        <a
          href="/"
          className="mt-6 inline-block rounded bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-hidden focus:ring-3"
        >
          Ir a Inicio
        </a>
      </div>
    </div>
  );
}

export default NotFound;
