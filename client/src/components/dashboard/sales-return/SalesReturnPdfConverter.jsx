import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { SalesReturnPDF } from "./SalesReturnPDF";

const SalesReturnPdfConverter = ({ report_list }) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div>
      <div style={{ display: "none" }}>
        <SalesReturnPDF ref={componentRef} report_list={report_list} />
      </div>
      <button onClick={handlePrint} className="export-button">
        PDF
      </button>
    </div>
  );
};

export default SalesReturnPdfConverter;
