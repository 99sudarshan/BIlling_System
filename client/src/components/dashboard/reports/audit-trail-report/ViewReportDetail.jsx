import React from "react";

const ViewReportDetail = ({ reportDetail, companyInfo }) => {
  const { name, address, phone, pan_no } = companyInfo[0];
  const {
    bill_no,
    customer_name,
    customer_pan,
    discount,
    total_amount,
    payment_method,
    created_at,
    ordered_date,
    items,
  } = reportDetail;
  return (
    <div>
      <div>
        <div className="container grid px-6 pb-2 mx-auto w-full dark:text-gray-300">
          <h2 className="mt-6 mb-2 text-xl text-center font-semibold text-gray-700 dark:text-gray-200 float-center">
            {name}
          </h2>
          <p className="mb-1 text-md text-center text-gray-700 dark:text-gray-200 float-center">
            {address}
          </p>
          <p className="text-md text-center text-gray-700 dark:text-gray-200 float-center">
            Phone: {phone}
          </p>
          <div className="text-center px-4 pt-3 text-sm">
            <span className="float-left">
              PAN: <span className="ml-4">{pan_no}</span>
            </span>
          </div>
          <div className="px-4 py-1 text-center text-sm">
            <span className="float-left">
              Bill No: <span className="ml-4">{bill_no}</span>
            </span>
            <span className="float-right">
              Transaction Date:
              <span className="ml-4">
                {new Date(created_at).toLocaleTimeString(undefined, {
                  year: "numeric",
                  month: "long",
                })}
              </span>
            </span>
          </div>
          <div className="px-4 py-1 text-center text-sm">
            <span className="float-left">
              Customer Name: <span className="ml-4">{customer_name}</span>
            </span>
            <span className="float-right">
              Invoice Issue Date:{" "}
              <span className="ml-4">
                {new Date(ordered_date).toLocaleTimeString(undefined, {
                  year: "numeric",
                  month: "long",
                })}
              </span>
            </span>
          </div>
          <div className="px-4 py-1 text-center text-sm pb-3">
            <span className="float-left">
              Customer PAN: <span className="ml-4">{customer_pan}</span>
            </span>
            <span className="float-right">
              Payment Method:{" "}
              <span className="ml-4">
                {payment_method.charAt(0).toUpperCase() +
                  payment_method.slice(1)}
              </span>
            </span>
          </div>
          <div className="w-full overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-bold tracking-wide text-left text-text dark:text-gray-200 uppercase  dark:bg-gray-800">
                    <th className="border dark:border-gray-900 px-4 py-3">
                      S.N.
                    </th>
                    <th className="border dark:border-gray-900 px-4 py-3">
                      Product
                    </th>
                    <th className="border dark:border-gray-900 px-4 py-3">
                      Quantity
                    </th>
                    <th className="border dark:border-gray-900 px-4 py-3">
                      Price
                    </th>
                    <th className="border dark:border-gray-900 px-4 py-3">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className=" dark:bg-gray-800 " id="orderItems">
                  {Array.isArray(items) &&
                    items.length > 0 &&
                    items.map((data, index) => {
                      return (
                        <tr
                          className="text-gray-700 dark:text-gray-200"
                          key={index}
                        >
                          <td className="border dark:border-gray-900 px-4 py-3 text-sm">
                            {index + 1}
                          </td>
                          <td className="border dark:border-gray-900 px-4 py-3 text-sm">
                            {data.product}
                          </td>
                          <td className="border dark:border-gray-900 px-4 py-3 text-sm">
                            {data.quantity}
                          </td>
                          <td className="border dark:border-gray-900 px-4 py-3 text-sm">
                            Rs.{data.price}
                          </td>
                          <td className="border dark:border-gray-900 px-4 py-3 text-sm">
                            Rs.{data.total_price}
                          </td>
                        </tr>
                      );
                    })}
                  <tr className="text-gray-700 dark:text-gray-300">
                    <td className=""></td>
                    <td className=""></td>
                    <td className=""></td>
                    <td className="border dark:border-gray-900 px-4 py-2 text-sm font-bold">
                      Discount
                    </td>
                    <td className="border dark:border-gray-900 px-4 py-2 text-sm">
                      Rs.{discount}
                    </td>
                  </tr>
                  <tr className="text-gray-700 dark:text-gray-300">
                    <td className=""></td>
                    <td className=""></td>
                    <td className=""></td>
                    <td className="border dark:border-gray-900 px-4 py-2 text-sm font-bold">
                      Net Amount
                    </td>
                    <td className="border dark:border-gray-900 px-4 py-2 text-sm">
                      Rs.{total_amount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-md text-gray-700 dark:text-gray-200 float-center">
            User: {name}, Time: 9:06 pm
          </p>
          <p className="mt-4 text-md text-center text-gray-700 dark:text-gray-200 float-center">
            Note: Prices are inclusive of all Govt. taxes
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewReportDetail;
