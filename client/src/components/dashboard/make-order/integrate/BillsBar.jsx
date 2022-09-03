import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingRing from "../../../common/LoadingRing";

const BillsBar = ({ hanleMakeOrder, customerInfo, handleChange, loading }) => {
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
    <div className="w-80 2xl:w-[24rem]">
      <div>
        <div className="w-full overflow-x-auto">
          <div>
            <div
              className="flex w-full text-xs font-semibold bg-gray-600 text-white 
                      tracking-wide text-left uppercase border-b dark:border-gray-700 
                      dark:text-gray-400 dark:bg-gray-800"
            >
              <span className=" py-3 w-[10%] text-center">S.N.</span>
              <span className="py-3 w-[30%] text-center">Item</span>
              <span className="py-3 w-1/4 text-center">quantity</span>
              <span className="py-3 w-1/4 text-center">Rate</span>
              <span className="py-3 w-1/4 text-center">Amount</span>
            </div>
            <div
              style={{ scrollbarWidth: "none" }}
              className="h-40  overflow-auto bg-grey-light w-full bg-green-100 divide-y dark:divide-gray-700 dark:bg-gray-800 dark:text-gray-200 text-xs category"
            >
              {order_item.map((data, index) => {
                const { product, quantity, price } = data;
                return (
                  <div
                    className="flex justify-between items-center  py-2"
                    key={index}
                  >
                    <span className="w-[10%] text-center"> {index + 1}</span>
                    <span className="w-[30%] text-center"> {product}</span>
                    <span className="w-1/4 text-center"> {quantity}</span>
                    <span className="w-1/4 text-center"> {price}</span>
                    <span className="w-1/4 text-center">
                      {" "}
                      {parseInt(quantity) * parseInt(price)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-405px)] mt-4 category pr-2 pb-2">
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
          <div className="mt-4">
            {id ? (
              <div className="flex justify-between gap-6 items-center">
                <button
                  className="flex justify-center items-center  text-gray-100 dark:bg-gray-800 dark:text-gray-200 border shadow-md  font-medium w-full px-4 py-2 
              leading-5  focus:outline-none bg-gray-700"
                  onClick={() =>
                    hanleMakeOrder(
                      getTotalAmount(order_item),
                      getNetAmount(order_item),
                      true
                    )
                  }
                >
                  Save & Print
                </button>
                <button
                  className="flex justify-center items-center  text-gray-100 dark:bg-gray-800 dark:text-gray-200 border shadow-md  font-medium w-full px-4 py-2 
              leading-5  focus:outline-none bg-gray-700"
                  onClick={() =>
                    hanleMakeOrder(
                      getTotalAmount(order_item),
                      getNetAmount(order_item)
                    )
                  }
                >
                  {loading ? <LoadingRing /> : "Save"}
                </button>
              </div>
            ) : (
              <button
                className="flex justify-center items-center  text-gray-100 dark:bg-gray-800 dark:text-gray-200 border shadow-md  font-medium w-full px-4 py-2 
              leading-5  focus:outline-none bg-gray-700"
                onClick={() =>
                  hanleMakeOrder(
                    getTotalAmount(order_item),
                    getNetAmount(order_item)
                  )
                }
              >
                {loading ? <LoadingRing /> : "Place Order"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillsBar;
