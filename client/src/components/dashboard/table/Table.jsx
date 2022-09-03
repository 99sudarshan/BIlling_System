import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  DinningTable,
  EditIcon,
  PlusIcon,
  TrashIcon,
} from "../../../assets/icons";
import {
  deleteTableData,
  fetchTableData,
  fetchTableDataById,
} from "../../api/services/system/systemUserApiService";
import CommonPopup from "../../common/CommonPopup";
import DeleteCard from "../../common/DeleteCard";
import MainHeader from "../../common/MainHeader";
import AddTable from "./AddTable";

const Table = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState({
    id: "",
    name: "",
    capacity: "",
    status: "",
  });
  const { table_list } = useSelector((state) => state.systemUser);
  const dispatch = useDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    name: "",
    id: "",
  });

  const handleDelete = () => {
    setIsDeleting(true);
    dispatch(
      deleteTableData(selectedItem.id, setIsDeleting, setOpenDeleteModal)
    );
  };

  const fetchTableDataByID = (id) => {
    fetchTableDataById(id, tableData, setTableData);
    setOpen(true);
  };

  useEffect(() => {
    dispatch(fetchTableData());
    //eslint-disable-next-line
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
      <CommonPopup
        open={open}
        closeModal={() => {
          setOpen(false);
          setTableData({
            ...tableData,
            id: "",
            name: "",
            capacity: "",
            status: "",
          });
        }}
        width="max-w-xl"
      >
        <AddTable
          closeModal={() => {
            setOpen(false);
            setTableData({
              ...tableData,
              id: "",
              name: "",
              capacity: "",
              status: "",
            });
          }}
          tableData={tableData}
        />
      </CommonPopup>
      <div>
        <MainHeader text="Company Info" />
        {/* <!-- Table --> */}
        <div className="w-full overflow-hidden shadow">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold bg-gray-600 text-white tracking-wide text-left uppercase border-b dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3">Table</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {table_list.length > 0 ? (
                  <>
                    {table_list.map((data, index) => {
                      const { id, name, capacity, status, order } = data;
                      return (
                        <tr
                          className="text-gray-700 dark:text-gray-400"
                          key={index}
                        >
                          <td className="px-4 flex">
                            {Object.keys(order).length > 0 ? (
                              <Link
                                to={
                                  width > 1024
                                    ? `/dashboard/${name}/orders/${order.id}`
                                    : `/dashboard/make-orders-staff/${id}/${order.id}`
                                }
                                className="flex items-center gap-2 relative"
                              >
                                <span className="absolute text-gray-200 dark:text-gray-900 font-medium text-xs top-8 right-5">
                                  {name}
                                </span>
                                <span>
                                  <DinningTable className="w-20 h-20" />
                                </span>
                              </Link>
                            ) : (
                              <div className="flex items-center gap-2 relative">
                                <span className="absolute text-gray-200 dark:text-gray-900 font-medium text-xs top-8 right-5">
                                  {name}
                                </span>
                                <span>
                                  <DinningTable className="w-20 h-20" />
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 text-sm">{capacity}</td>
                          <td className="px-4 text-xs">
                            {status === 1 ? (
                              <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                                Available
                              </span>
                            ) : (
                              <span className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:bg-red-700 dark:text-green-100">
                                Occupied
                              </span>
                            )}
                          </td>
                          <td className="px-4">
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center gap-4">
                                <button
                                  className="flex items-center gap-1 bg-background-lightGray text-sm rounded px-1 py-1 hover:text-blue-500 
                        font-semibold hover:bg-blue-100 animation dark:bg-gray-900 dark:text-gray-400 dark:hover:text-blue-500 dark:hover:bg-blue-100"
                                  onClick={() => {
                                    fetchTableDataByID(id);
                                  }}
                                >
                                  <EditIcon className="w-5 h-5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  className="flex items-center gap-1 bg-background-lightGray text-sm rounded px-1 py-1 hover:text-red-500 
                        font-semibold hover:bg-red-100 animation dark:bg-gray-900 dark:text-gray-400 
                        dark:hover:text-red-500 dark:hover:bg-red-100"
                                  onClick={() => {
                                    setSelectedItem({
                                      name,
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
                    })}
                  </>
                ) : (
                  <tr className="text-gray-700 dark:text-gray-400">
                    <td colSpan={4} className="px-4 py-3 text-sm ">
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
      <div className="absolute bottom-6 right-6" onClick={() => setOpen(!open)}>
        <button className="flex items-center justify-between px-3 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-gray-600 border border-transparent rounded-full active:bg-gray-600 hover:bg-gray-700 focus:outline-none focus:shadow-outline-gray">
          <PlusIcon className="w-8 h-8" />
        </button>
      </div>
    </>
  );
};

export default Table;
