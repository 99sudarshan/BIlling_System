import React from "react";

const EditReport = () => {
  return (
    <div>
      <div className="p-5 text-text dark:text-gray-300 space-y-6">
        <h1 className="text-lg text-center font-medium">
          Select the payment method
        </h1>
        <div>
          <div className="flex flex-col ">
            <span className="text-gray-700 dark:text-gray-400">Payment:</span>
            <select
              className="w-40"
              name="payment_type"
              // onChange={handleChange}
              // value={customerInfo.payment_type}
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
        <div>
          <button className="button-style">Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditReport;
