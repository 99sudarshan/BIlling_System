import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOrderroperyById } from "../../api/services/system/systemUserApiService";

const PrintReport = () => {
  const [detail, setDetail] = useState({});
  const { company_info } = useSelector((state) => state.systemUser);
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    dispatch(fetchOrderroperyById(id, setDetail));
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (Object.keys(detail).length > 0) {
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [detail]);

  const {
    amount,
    bill_no,
    customer_name,
    customer_pan,
    discount,
    total_amount,
    payment_method,
    created_at,
    ordered_date,
    items,
  } = detail;
  return (
    <div className="h-full w-full overflow-y-auto relative ">
      <p className="text-xs text-center text-gray-700 float-center">
        Report of sales return
      </p>
      <div className="w-full">
        <h3 className="text-md text-center font-semibold text-gray-700 float-center">
          Customer Invoice
        </h3>
        <h2 className="mb-1 text-lg text-center font-semibold text-gray-700 float-center">
          {company_info[0]?.name}
        </h2>
        <p className="text-md text-xs text-center text-gray-700 float-center">
          {bill_no}
        </p>
        {/* <p className="text-md text-center text-xs text-gray-700 float-center">
          Phone: 9825210392
        </p> */}
        <p className="text-md text-center text-xs text-gray-700 float-center">
          PAN: {company_info[0]?.pan_no}
        </p>
        <div className="flex flex-col">
          <p className="text-md text-xs text-gray-700 mt-2">
            <span className="float-left">Bill No: {bill_no}</span>
          </p>
          <p className="text-md text-center text-xs text-gray-700">
            <span className="float-left">
              Transaction Date:{" "}
              {new Date(created_at).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
          <p className="text-md text-center text-xs text-gray-700">
            <span className="float-left">
              Invoice Date:{" "}
              {new Date(ordered_date).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
          <p className="text-md text-center text-xs text-gray-700">
            <span className="float-left">Customer Name: {customer_name}</span>
          </p>
          <p className="text-md text-center text-xs text-gray-700">
            <span className="float-left">Customer PAN: {customer_pan}</span>
          </p>
          <p className="text-md text-center text-xs text-gray-700">
            <span className="float-left">
              Payment Mode:{" "}
              {payment_method?.charAt("0").toUpperCase() +
                payment_method?.slice(1)}
            </span>
          </p>
        </div>
        <div className="w-full overflow-hidden mt-3">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold text-gray-700 border-t-2 border-b-2 border-black border-dotted">
                  <td className="text-xs w-[46%]">Item</td>
                  <td className="text-xs w-[13%]">Qty.</td>
                  <td className="text-xs w-[18%]">Rate</td>
                  <td className="text-xs w-[23%]">Amount</td>
                </tr>
              </thead>
              <tbody className="dotted-line">
                {Array.isArray(items) &&
                  items.map((data, index) => {
                    const { product, quantity, total_price, price } = data;
                    return (
                      <tr className="text-xs text-gray-500" key={index}>
                        <td className="text-xs">
                          <span className="whitespace-pre-line">{product}</span>
                        </td>
                        <td className="text-xs">{quantity}</td>
                        <td className="text-xs">{price}</td>
                        <td className="text-xs">{total_price}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <div className="border-t-2 border-b-2 py-0.5 px-1 text-xs border-black border-dotted">
              <div className="flex items-center justify-end">
                <span className="font-semibold w-24 text-left">
                  Gross Amount:
                </span>
                <span className="w-16 text-right">Rs. {amount}</span>
              </div>
              <div className="flex items-center  justify-end">
                <span className="font-semibold w-24 text-left">Discount:</span>
                <span className="w-16 text-right">Rs. {discount}</span>
              </div>
            </div>
            <div className="text-xs flex items-center justify-end px-1 pt-0.5">
              <span className="font-semibold w-24 text-left">Net Amount</span>
              <span className="w-16 text-right">Rs. {total_amount}</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-center text-gray-600 float-center star-line">
          Note: Prices are inclusive of all Govt. taxes
        </p>
        <p className="text-xs text-center text-gray-600 float-center pb-1">
          Thank You, Please visit again
        </p>
        <p className="text-xs text-gray-600 dotted-line pt-1">
          User: {company_info[0]?.name}
        </p>
      </div>
    </div>
  );
};

export default PrintReport;
