import React, { useState, useEffect } from "react";
import TableRpp from "@/components/layout/TableRpp";
import { IoMdPersonAdd } from "react-icons/io";
import { IconContext } from "react-icons";
import { FormularioUsers } from "@/components/forms/FormularioUsers";
import { MdAttachMoney } from "react-icons/md";
import { Link } from "react-router-dom";
import { PiCurrencyDollarLight } from "react-icons/pi";
import { FcClock, FcOk, FcHighPriority } from "react-icons/fc";
import { FiCreditCard } from "react-icons/fi";
import { FcMoneyTransfer, FcCalendar, FcPlus } from "react-icons/fc";
import Card from "@/components/layout/Card";
import { datosTramites } from "@/services/rpp";
function Rpp() {
  const id = localStorage.getItem("id");
  const [datos, setDatosTramites] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  useEffect(() => {
    // Solicitar opciones al backend
    const fetchDatosTramites = async () => {
      try {
        const response = await datosTramites();
        setDatosTramites(response);
      } catch (error) {
        console.error("Error al obtener las opciones:", error);
      }
    };
    fetchDatosTramites();
  }, []);
  return (
    <div className="p-5">
      <div className="my-5 overflow-hidden w-full">
        <div className="grid 2xl:grid-cols-12 md:grid-cols-6 grid-cols-1 gap-2 justify-between">
          <div className="grid lg:col-span-1">
            <Card icono={<FcPlus />} text={datos.nuevo} estado={"NUEVO"} />
          </div>
          <div className="grid lg:col-span-1">
            <Card
              icono={<FcHighPriority />}
              text={datos.correccion}
              estado={"CORRECCION"}
            />
          </div>
          <div className="grid lg:col-span-1">
            <Card
              icono={<FcClock />}
              text={datos.en_proceso_count}
              estado={"EN PROCESO"}
            />
          </div>
          <div className="grid lg:col-span-1">
            <Card
              icono={<FcCalendar />}
              text={datos.error_count}
              estado={"EN ESPERA DE APROBACION"}
            />
          </div>
          <div className="grid lg:col-span-1">
            <Card
              icono={<FcMoneyTransfer />}
              text={datos.esperando_pago}
              estado={"PENDIENTE POR LIQUIDAR"}
            />
          </div>
          <div className="grid lg:col-span-1">
            <Card
              icono={<FcOk />}
              text={datos.terminado_count}
              estado={"FINALIZADO"}
            />
          </div>
          <div className="grid md:col-span-6 col-span-1">
            <div className="grid md:grid-cols-2 gap-2">
              <div className="grid col-span-1">
                <div className="flex flex-col justify-center gap-2 p-4   bg-white rounded-2xl">
                  <div className="flex justify-between items-center text-red-600">
                    <div className="flex items-center gap-2">
                      <div className="bg-red-100 rounded-lg p-2">
                        <IconContext.Provider
                          value={{
                            className: "global-class-name",
                            size: "2em",
                          }}
                        >
                          <FiCreditCard />
                        </IconContext.Provider>
                      </div>
                      <p className="text-gray-600 font-medium">
                        Trámites por pagar
                      </p>
                    </div>
                    <div className="bg-red-100 p-2 rounded-lg">
                      <p className="">Pendiente</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <p className="text-orange-600 text-base">
                      Monto pendiente:
                    </p>
                    <p className="text-orange-600 text-xl font-semibold">
                      ${datos.no_pagado_sum}
                    </p>
                  </div>
                  <div className="flex items-center gap-5 text-red-600">
                    <p className="text-base">
                      Monto por pagar:
                    </p>
                    <p className="text-3xl font-semibold">
                      ${datos.costo_total}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid col-span-1">
                <div className="flex flex-col justify-center gap-2 p-4   bg-white rounded-2xl">
                  <div className="flex justify-between items-center text-green-600">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 rounded-lg p-2">
                        <IconContext.Provider
                          value={{
                            className: "global-class-name",
                            size: "2em",
                          }}
                        >
                          <PiCurrencyDollarLight />
                        </IconContext.Provider>
                      </div>
                      <p className="text-gray-600 font-medium">
                        Trámites pagados
                      </p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-lg">
                      <p className="">Completado</p>
                    </div>
                  </div>

                  <p className="text-green-600 text-3xl font-semibold">
                    $ {datos.pagado_sum}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-3xl overflow-hidden w-full">
        <div className="p-5 mr-5 flex justify-between w-full">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 p-1">
            Trámites
          </h1>
          <div className="flex gap-5">
            <Link
              to="/catalogo"
              className=" text-primary  transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={() => {
                setShowDialog(true);
              }}
            >
              <IconContext.Provider
                value={{
                  className: "global-class-name",
                  size: "3em",
                }}
              >
                <MdAttachMoney />
              </IconContext.Provider>
            </Link>
            <button
              className=" text-primary  transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={() => {
                setShowDialog(true);
              }}
            >
              <IconContext.Provider
                value={{
                  className: "global-class-name",
                  size: "3em",
                }}
              >
                <IoMdPersonAdd />
              </IconContext.Provider>
            </button>
          </div>
        </div>
        <div className="p-5 w-full">
          <TableRpp />
        </div>
      </div>
      {showDialog && <FormularioUsers onClose={() => setShowDialog(false)} />}
    </div>
  );
}

export default Rpp;
