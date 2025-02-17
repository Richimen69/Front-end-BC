import React from "react";
import TableTramites from "@/components/layout/TableTramites";
function Tramites() {
  return (
    <div className="p-6 space-y-6">
      <div className=" bg-white mt-5 border rounded-3xl flex flex-col justify-center items-center">
        <TableTramites />
      </div>
    </div>
  );
}

export default Tramites;
