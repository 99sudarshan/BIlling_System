import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTableData } from "../../../api/services/system/systemUserApiService";

const TopInputBars = ({ customerInfo, errors, handleChange }) => {
  const { tables, company_info, edit_order } = useSelector(
    (state) => state.orderProduct
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTableData());
    //eslint-disable-next-line
  }, []);
  return (
    <div className="flex gap-6 flex-wrap  mt-5">
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
      {/* table  */}
      <div className="">
        <label htmlFor="">Table:</label>
        {Object.keys(edit_order).length > 0 ? (
          <input
            type="text"
            defaultValue={edit_order?.table.name}
            readOnly={true}
          />
        ) : (
          <select
            className="w-36"
            value={customerInfo.table}
            onChange={handleChange}
            name="table"
          >
            <option value="" hidden>
              Select Table
            </option>
            {tables.map((item, index) => {
              return (
                <option value={item.id} key={index}>
                  {item.name}
                </option>
              );
            })}
          </select>
        )}

        <p className="error">{errors.table}</p>
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
        <p className="error">{errors.customer_pan}</p>
      </div>
    </div>
  );
};

export default TopInputBars;
