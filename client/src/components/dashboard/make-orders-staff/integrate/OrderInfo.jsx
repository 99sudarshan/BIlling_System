import React from "react";
import MainHeader from "../../../common/MainHeader";

const OrderInfo = ({ items }) => {
  const getTotalAmount = () => {
    let amount = 0;
    items.forEach((data) => {
      amount += data.total_price;
    });
    return amount;
  };
  return (
    <div className=" px-4 pb-4">
      <div className="flex items-center gap-6">
        <MainHeader text="Order Info" />
        <p className="text-text-tertiary">Table no: A</p>
      </div>
      <div className="w-full overflow-hidden shadow">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr
                className="text-xs font-semibold bg-gray-600 text-white tracking-wide text-left uppercase border-b
               dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800"
              >
                <th className="px-4 py-3">SN</th>
                <th className="px-4 py-3">description</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">rate</th>
                <th className="px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700 dark:bg-gray-800">
              {items.map((data, index) => {
                const { product, price, quantity, total_price } = data;
                return (
                  <tr className="text-gray-700 dark:text-gray-400" key={index}>
                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">{product}</td>
                    <td className="px-4 py-3 text-xs">{quantity}</td>
                    <td className="px-4 py-3 text-sm">{price}</td>
                    <td className="px-4 py-3">{total_price}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between font-semibol text-sm mt-5 bg-blue-200 py-1 px-3 dark:bg-gray-800 dark:text-gray-200">
        <div>TOTAL AMOUNT</div>
        <div>Rs {getTotalAmount()}</div>
      </div>
    </div>
  );
};

export default OrderInfo;
