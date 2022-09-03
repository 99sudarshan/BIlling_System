import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeAllProductdata } from "../../../../redux/actions/orderproductAction";
import ProductCard from "../../make-orders-staff/integrate/order/ProductCard";

const ProductListBars = () => {
  const dispatch = useDispatch();
  const { all_products } = useSelector((state) => state.orderProduct);
  useEffect(() => {
    return () => {
      dispatch(removeAllProductdata());
    };
    //eslint-disable-next-line
  }, []);
  return (
    <div className="flex-1 h-full overflow-auto  bg-background-lightGray dark:bg-gray-800 p-4">
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6">
        {all_products.map((data, index) => {
          return (
            <div key={index} className="">
              <ProductCard admin={true} {...data} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductListBars;
