import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { DinningTable, EditIcon, TrashIcon } from "../../../assets/icons";
import {
  deleteOrderData,
  fetchCurrentOrderData,
} from "../../api/services/make-order/makeOrderApiService";
import CommonPopup from "../../common/CommonPopup";
import DeleteCard from "../../common/DeleteCard";
import MainHeader from "../../common/MainHeader";

const OrdersTable = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [currentOrders, setCurrentOrders] = useState([]);
  const dispatch = useDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    name: "",
    id: "",
  });
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const handleDelete = () => {
    setIsDeleting(true);
    dispatch(
      deleteOrderData(
        selectedItem.id,
        setCurrentOrders,
        setIsDeleting,
        setOpenDeleteModal
      )
    );
  };

  useEffect(() => {
    fetchCurrentOrderData(setCurrentOrders);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  });

  return (
    <>
      <CommonPopup
        open={openDeleteModal}
        closeModal={() => setOpenDeleteModal(false)}
        width="w-64"
      >
        <DeleteCard
          name={selectedItem.name}
          loading={isDeleting}
          closeModal={() => setOpenDeleteModal(false)}
          deleteData={handleDelete}
        />
      </CommonPopup>
      <div>
        <MainHeader text="Current Orders" />
        {/* <!-- Table --> */}
        <div className="w-full overflow-hidden shadow">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold bg-gray-600 text-white tracking-wide text-left uppercase border-b dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3">S.N.</th>
                  <th className="px-4 py-3">table</th>
                  <th className="px-4 py-3">customer name</th>
                  <th className="px-4 py-3">quantity of items</th>
                  <th className="px-4 py-3">date/time</th>
                  <th className="px-4 py-3">total price</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {Array.isArray(currentOrders) && currentOrders.length > 0 ? (
                  currentOrders.map((data, index) => {
                    const {
                      id,
                      customer_name,
                      ordered_date,
                      total_amount,
                      table,
                      items,
                    } = data;
                    return (
                      <tr
                        className="text-gray-700 dark:text-gray-400"
                        key={index}
                      >
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3 text-sm flex">
                          <div className="flex items-center gap-2 relative ">
                            <span className="absolute text-gray-200 dark:text-gray-900 font-medium text-xs top-8 right-5">
                              {table?.name}
                            </span>
                            <span>
                              <DinningTable className="w-20 h-20" />
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{customer_name}</td>
                        <td className="px-4 py-3 text-xs">
                          <ul>
                            {Array.isArray(items) &&
                              items.map((order, index) => {
                                return (
                                  <li key={index}>
                                    {order.product}({order.quantity})
                                  </li>
                                );
                              })}
                          </ul>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(ordered_date).toLocaleTimeString(
                            undefined,
                            options
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">{total_amount}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center gap-4">
                              <Link
                                to={
                                  width > 1024
                                    ? `/dashboard/make-orders/${id}`
                                    : `/dashboard/make-orders-staff/${table.id}/${id}`
                                }
                                className="flex items-center gap-1 bg-background-lightGray text-sm rounded px-1 py-1 hover:text-blue-500 
                    font-semibold hover:bg-blue-100 animation dark:bg-gray-900 dark:text-gray-400 dark:hover:text-blue-500 dark:hover:bg-blue-100"
                              >
                                <EditIcon className="w-5 h-5" />
                                <span>Edit</span>
                              </Link>
                              <button
                                className="flex items-center gap-1 bg-background-lightGray text-sm rounded px-1 py-1 hover:text-red-500 
                    font-semibold hover:bg-red-100 animation dark:bg-gray-900 dark:text-gray-400 
                    dark:hover:text-red-500 dark:hover:bg-red-100"
                                onClick={() => {
                                  setSelectedItem({
                                    name: `${table?.name} Order`,
                                    id,
                                  });
                                  setOpenDeleteModal(true);
                                }}
                              >
                                <TrashIcon className="w-5 h-5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="text-gray-700 dark:text-gray-400">
                    <td colSpan={7} className="px-4 py-3 text-sm ">
                      <div className="flex justify-center items-center w-full">
                        no data to show
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersTable;
