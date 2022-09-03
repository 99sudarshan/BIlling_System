import React from "react";
import exportFromJSON from "export-from-json";

const Excell = ({ file, data }) => {
  const fileName = file;
  const exportType = exportFromJSON.types.xls;
  return (
    <div>
      <button
        onClick={() => exportFromJSON({ data, fileName, exportType })}
        className="export-button"
      >
        Excel
      </button>
    </div>
  );
};

export default Excell;
