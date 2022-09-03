import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CommonPopup from "../../common/CommonPopup";
import MainHeader from "../../common/MainHeader";
import TableCard from "./integrate/TableCard";
import OrderInfo from "./integrate/OrderInfo";
import { fetchTableData } from "../../api/services/system/systemUserApiService";

const MakeOrderStaff = () => {
  const [value, setValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const { table_list } = useSelector((state) => state.systemUser);
  const [orderDetail, setOrderDetail] = useState([]);
  const dispatch = useDispatch();

  const closeModal = () => {
    setOrderDetail([]);
    setOpenModal(false);
  };

  useEffect(() => {
    dispatch(fetchTableData());
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <CommonPopup open={openModal} closeModal={closeModal} width="max-w-md">
        <OrderInfo items={orderDetail} />
      </CommonPopup>
      <div className="z-[10]">
        <MainHeader text="Table List" />
        {/*  search */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* search table  */}
          <div className="relative ">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search table"
            />
            <span className="absolute top-3.5 right-2 text-gray-500 dark:text-gray-400">
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
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 py-10">
          {table_list
            .filter((data) => {
              if (!value) return true;
              if (data.name.toLowerCase().includes(value.toLocaleLowerCase())) {
                return true;
              } else return false;
            })
            .map((data, index) => {
              return (
                <TableCard
                  key={index}
                  {...data}
                  setOpenModal={setOpenModal}
                  setOrderDetail={setOrderDetail}
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default MakeOrderStaff;
