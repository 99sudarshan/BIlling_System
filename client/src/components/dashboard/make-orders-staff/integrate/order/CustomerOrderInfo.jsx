import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingRing from "../../../../common/LoadingRing";
import MainHeader from "../../../../common/MainHeader";

const CustomerOrderInfo = ({
  hanleMakeOrder,
  handleChange,
  customerInfo,
  loading,
}) => {
  const { order_item } = useSelector((state) => state.orderProduct);
  const { id } = useParams();
  const getTotalAmount = (data) => {
    let amount = 0;
    data.forEach((data) => {
      amount = amount + parseInt(data.quantity) * parseInt(data.price);
    });
    return amount;
  };

  const getNetAmount = () => {
    const amount = getTotalAmount(order_item);
    if (customerInfo.discount) {
      return amount - parseInt(customerInfo.discount);
    } else {
      return amount;
    }
  };

  const getReturnAmount = () => {
    const amount = getNetAmount(order_item);
    if (customerInfo.recievedAmount) {
      return parseInt(customerInfo.recievedAmount) - amount;
    } else {
      return amount;
    }
  };

  return (
    <div className=" px-4 pb-4">
      <div className="flex items-center gap-6">
        <MainHeader text="Order Info" />
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
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">rate</th>
                <th className="px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700 dark:bg-gray-800">
              {order_item.map((data, index) => {
                const { product, quantity, price } = data;
                return (
                  <tr className="text-gray-700 dark:text-gray-400" key={index}>
                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">{product}</td>
                    <td className="px-4 py-3 text-xs">{quantity}</td>
                    <td className="px-4 py-3 text-sm">{price}</td>
                    <td className="px-4 py-3">
                      {parseInt(quantity) * parseInt(price)}
                    </td>
                  </tr>
                );
              })}
              <tr className="text-gray-700 dark:text-gray-400">
                <td colSpan={5}>
                  <div className="flex items-center justify-between font-semibol text-sm bg-blue-200 py-1 px-3 dark:bg-gray-800 dark:text-gray-200">
                    <div>TOTAL AMOUNT</div>
                    <div className="mr-5">Rs.{getTotalAmount(order_item)}</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* bill info  */}
      <div className="mt-4  h-[12rem] pr-2 pb-2 overflow-auto">
        {/* gross amount  */}
        <div className="flex justify-end items-center gap-2">
          <span className="text-gray-700 dark:text-gray-400 my-2">
            Gross Amount:
          </span>
          <span className="w-40 px-4 py-3 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 font-semibold text-text">
            Rs.{getTotalAmount(order_item)}
          </span>
        </div>
        {/* Discount amount  */}
        <div className="flex justify-end items-center gap-2">
          <span className="text-gray-700 dark:text-gray-400 my-2">
            Discount:
          </span>
          <input
            type="number"
            name="discount"
            value={customerInfo.discount}
            onChange={handleChange}
            className="w-40"
            placeholder="Discount"
          />
        </div>
        {/* Net amount  */}
        <div className="flex justify-end items-center gap-2 mt-1">
          <span className="text-gray-700 dark:text-gray-400 my-2">
            Net Amount:
          </span>
          <span className="w-40 px-4 py-3 text-sm bg-gray-600 text-white dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 ">
            Rs.{getNetAmount()}
          </span>
        </div>
        {/* Received amount  */}
        <div className="flex justify-end items-center gap-2">
          <span className="text-gray-700 dark:text-gray-400 my-2">
            Received Amount:
          </span>
          <input
            type="number"
            className="w-40"
            placeholder="0"
            name="recievedAmount"
            value={customerInfo.recievedAmount}
            onChange={handleChange}
          />
        </div>
        {/* Return amount  */}
        <div className="flex justify-end items-center gap-2 mt-1">
          <span className="text-gray-700 dark:text-gray-400 my-2">
            Return Amount:
          </span>
          <span className="w-40 px-4 py-3 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 font-semibold text-text">
            Rs.{getReturnAmount().toFixed(3)}
          </span>
        </div>
        {/* Payment  */}
        <div className="flex justify-end items-center gap-2">
          <span className="text-gray-700 dark:text-gray-400 my-2">
            Payment:
          </span>
          <select
            className="w-40"
            name="payment_type"
            onChange={handleChange}
            value={customerInfo.payment_type}
          >
            <option hidden>Select Payment</option>
            <option value="unpaid">Unpaid</option>
            <option value="cash">Cash</option>
            <option value="credit">Credit</option>
            <option value="card">Card</option>
            <option value="esewa">Esewa</option>
          </select>
        </div>
      </div>
      {/* bill info end here  */}
      <div className="mt-5">
        <button
          className="button-style"
          onClick={() =>
            hanleMakeOrder(getTotalAmount(order_item), getNetAmount(order_item))
          }
          disabled={loading}
        >
          {loading ? <LoadingRing /> : id ? "Update Order" : "Make Order"}
        </button>
      </div>
    </div>
  );
};

export default CustomerOrderInfo;
