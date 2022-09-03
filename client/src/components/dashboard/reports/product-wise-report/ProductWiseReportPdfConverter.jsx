import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ProductWiseReportPDF } from "./ProductWiseReportPDF";

const ProductWiseReportPdfConverter = ({ report_list }) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div>
      <div style={{ display: "none" }}>
        <ProductWiseReportPDF ref={componentRef} report_list={report_list} />
      </div>
      <button onClick={handlePrint} className="export-button">
        PDF
      </button>
    </div>
  );
};

export default ProductWiseReportPdfConverter;
