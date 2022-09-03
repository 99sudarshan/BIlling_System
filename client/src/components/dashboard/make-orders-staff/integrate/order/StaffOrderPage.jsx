import React, { useState } from "react";
import MainHeader from "../../../../common/MainHeader";
import CreatableSelect from "react-select";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import { BillIcon } from "../../../../../assets/icons";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeAllProductdata } from "../../../../../redux/actions/orderproductAction";
import CommonPopup from "../../../../common/CommonPopup";
import CustomerOrderInfo from "./CustomerOrderInfo";
import { useNavigate, useParams } from "react-router-dom";
import {
  editMakeOrder,
  fetchMakeOrderData,
  fetchMakeOrderDataByTableId,
  fetchProductBycategory,
  fetchProductBycategoryAndOrderId,
  makeOrder,
} from "../../../../api/services/make-order/makeOrderApiService";

const StaffOrderPage = () => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const { id, tableId } = useParams();
  const { dark_mode } = useSelector((state) => state.darkMode);

  const [customerInfo, setCustomerInfo] = useState({
    customer_name: "",
    customer_pan: "",
    table: "",
    payment_type: "unpaid",
    table_error: "",
    discount: "",
    recievedAmount: 0,
  });

  const { company_info, all_products, categories, edit_order, order_item } =
    useSelector((state) => state.orderProduct);

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      color: `${dark_mode && "#f4f5f7"}`,
      padding: 5,
      backgroundColor: `${dark_mode ? "#1a1c23" : "#fff"}`,
    }),
    input: (provided, state) => ({
      ...provided,
      color: "red",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? dark_mode
          ? "#111827"
          : "#F3F4F6"
        : null,
      color: `${dark_mode && "#f4f5f7"}`,
    }),
    control: () => ({
      display: "flex",
      width: 250,
      border: `1px solid ${dark_mode ? "#4B5563" : "#E8E9EB"}`,
      backgroundColor: `${dark_mode && "#374151"}`,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "inherit",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: `${dark_mode && "#f4f5f7"}`,
      fontSize: 14,
    }),
  };

  const handleChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const hanleMakeOrder = (amount, netAmount) => {
    const { customer_name, customer_pan, payment_type, discount } =
      customerInfo;
    const formData = {
      timestamp: `${Date.now()}`,
      table: tableId,
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
    if (id) {
      dispatch(
        editMakeOrder(id, formData, setCustomerInfo, setLoading, navigate)
      );
    } else {
      dispatch(makeOrder(formData, setCustomerInfo, setLoading, navigate));
    }
  };

  const handleCategoryChange = (newValue) => {
    setSelectedOption(newValue);
    if (id) {
      dispatch(fetchProductBycategoryAndOrderId(newValue.value, id));
    } else {
      dispatch(fetchProductBycategory(newValue.value));
    }
  };

  useEffect(() => {
    return () => {
      dispatch(removeAllProductdata());
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const newcategory = categories.map((data) => {
      return { value: data.id, label: data.name };
    });
    setOptions(newcategory);
    setSelectedOption(newcategory[0]);
  }, [categories]);

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
    <>
      <CommonPopup
        open={openModal}
        closeModal={() => setOpenModal(false)}
        width="max-w-md"
      >
        <CustomerOrderInfo
          hanleMakeOrder={hanleMakeOrder}
          handleChange={handleChange}
          customerInfo={customerInfo}
          loading={loading}
        />
      </CommonPopup>
      <div>
        <div className="flex items-center justify-between">
          <MainHeader text="Order" />
          <div
            className="relative  text-text dark:text-gray-200 bg-background-lightGray h-14 w-14 grid place-content-center 
            dark:bg-gray-800 border border-border-extraLight dark:border-none "
            onClick={() => setOpenModal(true)}
          >
            <span className="absolute top-0 left-0 text-xs font-semibold bg-red-100 p-1 text-red-700 rounded-full dark:bg-red-600 dark:text-white">
              {order_item.length}
            </span>
            <BillIcon className="w-8 h-8 " />
          </div>
        </div>
        {/* search table  */}
        <div className="mb-3">
          <div className="relative ">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search Product"
            />
            <span className="absolute top-2.5 right-2 text-gray-500 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          {/* Fiscal Yea */}
          <div className="">
            <label htmlFor="">Fiscal Year:</label>
            <input
              type="text"
              name=""
              id=""
              defaultValue={company_info[0]?.fiscal_year}
              readOnly={true}
            />
          </div>
          {/* categories  */}
          <div className="">
            <label htmlFor="">Category</label>
            <CreatableSelect
              value={selectedOption}
              options={options}
              styles={customStyles}
              onChange={handleCategoryChange}
            />
          </div>
          {/* customer name */}
          <div className="">
            <label htmlFor="">Customer Name:</label>
            <input
              type="text"
              name="customer_name"
              value={customerInfo.customer_name}
              onChange={handleChange}
              placeholder="Customer Name"
            />
          </div>
          {/* customer pan */}
          <div>
            <label htmlFor="">Customer PAN:</label>
            <input
              type="text"
              name="customer_pan"
              value={customerInfo.customer_pan}
              onChange={handleChange}
              placeholder="Customer PAN"
            />
          </div>
        </div>
        {/* product list  */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mt-5">
          {all_products
            .filter((data) => {
              if (!value) return true;
              if (data.name.toLowerCase().includes(value.toLowerCase())) {
                return true;
              } else return false;
            })
            .map((data, index) => {
              return <ProductCard key={index} {...data} />;
            })}
        </div>
      </div>
    </>
  );
};

export default StaffOrderPage;
