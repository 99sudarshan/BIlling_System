import React from "react";
import { Link } from "react-router-dom";
import { EditIcon, PlusIcon, ViewIcon } from "../../../../assets/icons";

const TableCard = ({
  id,
  name,
  capacity,
  status,
  order,
  setOpenModal,
  setOrderDetail,
}) => {
  return (
    <div className="bg-background-lightGray  border border-border-extraLight dark:border-gray-900 dark:bg-gray-800  p-4 space-y-4 z-[1]">
      <div className="flex items-center justify-between">
        <div className="">
          <h1 className="text-2xl font-bold text-text dark:text-gray-200">
            {name}
          </h1>
          <p className="text-xs text-text-tertiary dark:text-gray-400">
            capacity: {capacity}
          </p>
        </div>
        <div className="">
          <span
            className={`rounded-full font-semibold text-xs ${
              status !== 1
                ? "text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700"
                : "text-green-700 bg-green-100 dark:text-green-100 dark:bg-green-700"
            } px-2 py-0.5`}
          >
            {status !== 1 ? "occupied" : "available"}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="flex items-center gap-1 bg-gray-200 text-text text-xs  px-1 py-1 hover:text-blue-500 
            font-semibold hover:bg-blue-100  dark:bg-gray-900 dark:text-gray-400 dark:hover:text-blue-500 dark:hover:bg-blue-100"
          onClick={() => {
            status !== 1 && setOrderDetail(order.items);
            status !== 1 && setOpenModal(true);
          }}
        >
          <ViewIcon className="w-3.5 h-3.5" />
          <span>View</span>
        </button>
        <Link
          to={
            status !== 1
              ? `/dashboard/make-orders-staff/${id}/${order?.id}`
              : `/dashboard/make-orders-staff/${id}`
          }
          className="flex items-center gap-1 bg-gray-200 text-text text-xs  px-1 py-1 hover:text-blue-500 
            font-semibold hover:bg-blue-100  dark:bg-gray-900 dark:text-gray-400 dark:hover:text-blue-500 dark:hover:bg-blue-100"
        >
          {status === 1 ? (
            <EditIcon className="w-2 h-2" />
          ) : (
            <PlusIcon className="w-2 h-2" />
          )}
          <span>{status !== 1 ? "Edit Item" : "Add Item"}</span>
        </Link>
      </div>
    </div>
  );
};

export default TableCard;
