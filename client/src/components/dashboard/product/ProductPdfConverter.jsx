import React, { useRef } from "react";
import { ProductsPdf } from "./ProductsPdf";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";

const ProductPdfConverter = () => {
  const { product_list } = useSelector((state) => state.product);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div>
      <div style={{ display: "none" }}>
        <ProductsPdf ref={componentRef} product_list={product_list} />
      </div>
      <button onClick={handlePrint} className="export-button">
        PDF
      </button>
    </div>
  );
};

export default ProductPdfConverter;
