import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  editMakeOrder,
  editMakeOrderAndPrint,
  fetchMakeOrderData,
  fetchMakeOrderDataByTableId,
  fetchProductBycategory,
  makeOrder,
} from "../../api/services/make-order/makeOrderApiService";
import BillsBar from "./integrate/BillsBar";
import CategoriesBar from "./integrate/CategoriesBar";
import { ordervalidation } from "./integrate/ordervalidation";
import ProductListBars from "./integrate/ProductListBars";
import TopInputBars from "./integrate/TopInputBars";

const MakeOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { company_info, categories, edit_order } = useSelector(
    (state) => state.orderProduct
  );
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    customer_name: "",
    customer_pan: "",
    table: "",
    payment_type: "unpaid",
    discount: "",
    recievedAmount: 0,
  });
  const [errors, setErrors] = useState({
    table: "",
    customer_pan: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };
  const hanleMakeOrder = (amount, netAmount, print) => {
    const { customer_name, customer_pan, table, payment_type, discount } =
      customerInfo;
    const error = { ...errors };
    let goAhead = true;
    let validate = ["table", "customer_pan"];
    validate.forEach((data) => {
      const msg = ordervalidation(data, customerInfo[data]);
      error[data] = msg;
      if (msg) {
        goAhead = false;
      }
    });
    const formData = {
      timestamp: `${Date.now()}`,
      table: parseInt(table),
      customer_name,
      customer_pan,
      financial_year: company_info[0]?.fiscal_year,
      amount: parseInt(amount),
      total_discount: discount === "" ? 0 : parseInt(discount),
      tax_amount: 0,
      service_amount: 0,
      payment_type: payment_type,
      total_amount: parseInt(netAmount),
    };
    if (goAhead) {
      if (id) {
        if (print) {
          dispatch(
            editMakeOrderAndPrint(
              id,
              formData,
              setCustomerInfo,
              setLoading,
              navigate
            )
          );
        } else {
          dispatch(
            editMakeOrder(id, formData, setCustomerInfo, setLoading, navigate)
          );
        }
      } else {
        dispatch(makeOrder(formData, setCustomerInfo, setLoading, navigate));
      }
    }
    setErrors(error);
  };
  useEffect(() => {
    if (!id) {
      dispatch(fetchMakeOrderData());
    } else {
      dispatch(fetchMakeOrderDataByTableId(id));
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    categories.length > 0 &&
      !id &&
      dispatch(fetchProductBycategory(categories[0].id));
    //eslint-disable-next-line
  }, [categories]);

  useEffect(() => {
    Object.keys(edit_order).length > 0 &&
      setCustomerInfo({
        ...customerInfo,
        customer_name: edit_order.customer_name,
        customer_pan: edit_order.customer_pan,
        table: edit_order.table.id,
        discount: edit_order.discount,
      });
    //eslint-disable-next-line
  }, [edit_order]);

  return (
    <div className="">
      {/*order top bar  */}
      <TopInputBars
        customerInfo={customerInfo}
        errors={errors}
        handleChange={handleChange}
      />
      <div className="h-[calc(100vh-10.5rem)] w-full overflow-hidden  flex justify-between pt-5 gap-3">
        <div className="flex justify-between flex-1 h-full gap-3">
          <CategoriesBar />
          <ProductListBars />
        </div>
        <BillsBar
          hanleMakeOrder={hanleMakeOrder}
          customerInfo={customerInfo}
          handleChange={handleChange}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default MakeOrder;
