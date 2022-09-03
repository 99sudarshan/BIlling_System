import React from "react";
import exportFromJSON from "export-from-json";

const CSV = ({ file, data }) => {
  const fileName = file;
  const exportType = exportFromJSON.types.csv;
  return (
    <div>
      <button
        onClick={() => exportFromJSON({ data, fileName, exportType })}
        className="export-button"
      >
        CSV
      </button>
    </div>
  );
};

export default CSV;
