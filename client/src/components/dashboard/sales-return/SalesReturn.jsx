import React, { useState } from "react";
import MainHeader from "../../common/MainHeader";
import { Link } from "react-router-dom";
import CreatableSelect from "react-select";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import {
  addSalesReturn,
  fetchSalesReturnData,
} from "../../api/services/system/systemUserApiService";
import CommonPopup from "../../common/CommonPopup";
import LoadingRing from "../../common/LoadingRing";

const SalesReturn = () => {
  const [loading, setLoading] = useState(false);
  const [isSaleReturn, setIsSaleReturn] = useState(false);
  const [reason, setReason] = useState("");
  const [salesReturnData, setSalesReturnData] = useState([]);
  const [companyInfo, setCompanyInfo] = useState({});
  const [saleDetail, setSaleDetail] = useState({});
  const { dark_mode } = useSelector((state) => state.darkMode);
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      color: `${dark_mode && "#f4f5f7"}`,
      padding: 5,
      backgroundColor: `${dark_mode ? "#1a1c23" : "#fff"}`,
    }),
    input: (provided, state) => ({
      ...provided,
      // color: "red",
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

  const handleChange = (data) => {
    setSaleDetail(data.value);
  };
  const handleReturn = (e) => {
    e.preventDefault();
    const formData = {
      return_reason: reason,
    };
    setLoading(true);
    addSalesReturn(
      formData,
      saleDetail.id,
      setSalesReturnData,
      setCompanyInfo,
      closeModal,
      setLoading
    );
  };
  const closeModal = () => {
    setIsSaleReturn(false);
    setReason("");
    setSaleDetail({});
  };

  useEffect(() => {
    fetchSalesReturnData(setSalesReturnData, setCompanyInfo, closeModal);
  }, []);

  return (
    <>
      <CommonPopup open={isSaleReturn} closeModal={closeModal} width="max-w-lg">
        <div className="p-4">
          <h2 className="mt-6 mb-2 text-xl text-center font-semibold text-text dark:text-gray-200 float-center">
            Are you sure you want to return this sale and cancel the bill?
          </h2>
          <form className="px-4 py-2" onSubmit={handleReturn}>
            <label className="font-bold">Reason: </label>
            <textarea
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
            <button
              className="flex mt-4 justify-center items-center  text-gray-100 dark:bg-gray-800 dark:text-gray-200 border shadow-md  font-medium w-full px-4 py-2 
              leading-5  focus:outline-none bg-gray-700"
              disabled={loading}
            >
              {loading ? <LoadingRing /> : "Confirm"}
            </button>
          </form>
        </div>
      </CommonPopup>
      <div className="pb-10">
        <div className="flex justify-between items-center ">
          <MainHeader text="Sales Return" />
          <div>
            <Link to="/dashboard/sales-return-report" className="button-style">
              Report
            </Link>
          </div>
        </div>
        <div className="bg-gray-50 border dark:border-none p-4 dark:bg-gray-800 space-y-4">
          <div className="">
            <label htmlFor="">Enter Bill:</label>
            <CreatableSelect
              isClearable
              options={salesReturnData.map((data) => {
                return {
                  value: data,
                  label: data.bill_no,
                };
              })}
              styles={customStyles}
              onChange={handleChange}
            />
          </div>
          <div className="">
            <label htmlFor="">Enter Name:</label>
            <CreatableSelect
              isClearable
              options={options}
              styles={customStyles}
              onChange={handleChange}
            />
          </div>
        </div>
        {Object.keys(saleDetail).length > 0 && (
          <div className="w-full bg-gray-50  p-4 dark:bg-gray-800 overflow-hidden shadow-xs px-4 py-4 mt-5 border dark:border-none relative">
            <div className="absolute -top-4 right-0">
              <button
                className="flex mt-4 justify-center items-center  text-gray-100 dark:bg-gray-800 dark:text-gray-200 border shadow-md  font-medium w-full px-4 py-2 
              leading-5  focus:outline-none bg-gray-700"
                onClick={() => setIsSaleReturn(true)}
              >
                Sales Return
              </button>
            </div>
            <div className="container grid w-full">
              <h2 className="mb-1 text-lg text-center font-semibold text-text dark:text-gray-300">
                {companyInfo[0].name}
              </h2>
              <p className="text-md text-center text-text dark:text-gray-300 float-center">
                <span className="font-semibold">Bill No:</span>{" "}
                <span id="bill_billno">{saleDetail?.bill_no}</span>
              </p>
              <p className="text-md text-center text-text dark:text-gray-300 float-center">
                <span className="font-semibold">Date:</span>{" "}
                <span id="bill_datenow">
                  {new Date(saleDetail?.ordered_date).toLocaleString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </p>
              <p className="text-md text-center text-text dark:text-gray-300 float-center">
                <span className="font-semibold">Customer Name:</span>
                <span id="customer_name">{saleDetail?.customer_name}</span>
              </p>
              <p className="text-md text-center text-text dark:text-gray-300 float-center">
                <span className="font-semibold">Customer PAN:</span>
                <span id="customer_pan">{saleDetail?.customer_pan}</span>
              </p>
              <div className="w-full overflow-hidden mt-4">
                <div className="w-full overflow-x-auto">
                  <table className="w-full whitespace-no-wrap">
                    <thead>
                      <tr className="text-md font-bold text-text dark:text-gray-300 dotted-line">
                        <td className="text-md">Key</td>
                        <td className="text-md">Value</td>
                      </tr>
                    </thead>
                    <tbody className="dotted-line">
                      <tr className="text-text-tertiary dark:text-gray-400 dotted-line">
                        <td className="text-md font-bold">Bill Amount:</td>
                        <td className="text-md font-medium" id="bill_amount">
                          Rs.{saleDetail?.amount}
                        </td>
                      </tr>
                      <tr className="text-text-tertiary dark:text-gray-400 dotted-line">
                        <td className="text-md font-bold">Discount:</td>
                        <td className="text-md font-medium" id="bill_discount">
                          Rs.{saleDetail?.discount}
                        </td>
                      </tr>
                      <tr className="text-text-tertiary dark:text-gray-400 star-line my-1">
                        <td className="text-md font-bold">Tax Amount:</td>
                        <td className="text-md font-medium" id="bill_tax">
                          Rs.{saleDetail?.tax_amount}
                        </td>
                      </tr>
                      <tr className="text-text-tertiary dark:text-gray-400 dotted-line">
                        <td className="pb-2 text-md font-bold">
                          Service Amount:
                        </td>
                        <td
                          className="pb-2 text-md font-bold"
                          id="bill_service"
                        >
                          Rs.{saleDetail?.service_amount}
                        </td>
                      </tr>
                      <tr className="text-text-tertiary dark:text-gray-400 dotted-line">
                        <td className="pb-2 text-md font-bold">
                          Total Amount:
                        </td>
                        <td className="pb-2 text-md font-bold" id="bill_total">
                          Rs.{saleDetail?.total_amount}
                        </td>
                      </tr>
                      <tr className="text-text-tertiary dark:text-gray-400 dotted-line">
                        <td className="pb-2 text-md font-bold">
                          Is Sales Return:
                        </td>
                        <td className="pb-2 text-md font-bold" id="bill_return">
                          {saleDetail?.sales_return ? "true" : "false"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-xs text-center text-text-tertiary dark:text-gray-400 float-center star-line">
                Note: Prices are inclusive of all Govt. taxes
              </p>
              <p className="text-xs text-center text-text-tertiary dark:text-gray-400 float-center">
                Thank You, Please do come again
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SalesReturn;
