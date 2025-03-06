import React, { useState, useEffect } from "react";
import TableRpp from "@/components/layout/TableRpp";
import { IoMdPersonAdd } from "react-icons/io";
import { IconContext } from "react-icons";
import { FormularioUsers } from "@/components/forms/FormularioUsers";
function Rpp() {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <div className="p-5">
      <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-3xl overflow-hidden w-full">
        <div className="p-5 mr-5 flex justify-between w-full">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 p-1">
            Trámites
          </h1>
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
        <div className="p-5 w-full">
          <TableRpp />
        </div>
      </div>
      {showDialog && <FormularioUsers onClose={() => setShowDialog(false)} />}
    </div>
  );
}

export default Rpp;
