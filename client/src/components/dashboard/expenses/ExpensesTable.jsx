import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditIcon, PlusIcon, TrashIcon } from "../../../assets/icons";
import {
  deleteExpensesData,
  fetchExpensesData,
  fetchExpensesDataById,
} from "../../api/services/system/systemUserApiService";
import CommonPopup from "../../common/CommonPopup";
import DeleteCard from "../../common/DeleteCard";
import MainHeader from "../../common/MainHeader";
import AddExpenses from "./AddExpenses";

const ExpensesTable = () => {
  const dispatch = useDispatch();
  const { expenses_list } = useSelector((state) => state.systemUser);
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState({
    id: "",
    name: "",
    amount: "",
  });
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    name: "",
    id: "",
  });

  const handleDelete = () => {
    setIsDeleting(true);
    dispatch(
      deleteExpensesData(selectedItem.id, setIsDeleting, setOpenDeleteModal)
    );
  };

  const fetchTableDataByID = (id) => {
    fetchExpensesDataById(id, tableData, setTableData);
    setOpen(true);
  };

  useEffect(() => {
    dispatch(fetchExpensesData());
    //eslint-disable-next-line
  }, []);
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
            amount: "",
          });
        }}
        width="max-w-xl"
      >
        <AddExpenses
          closeModal={() => {
            setOpen(false);
            setTableData({
              ...tableData,
              id: "",
              name: "",
              amount: "",
            });
          }}
          tableData={tableData}
        />
      </CommonPopup>
      <div>
        <MainHeader text="Expenses" />
        {/* <!-- Table --> */}
        <div className="w-full overflow-hidden shadow">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold bg-gray-600 text-white tracking-wide text-left uppercase border-b dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {expenses_list.length > 0 ? (
                  <>
                    {expenses_list.map((item, index) => {
                      const { id, amount, name } = item;
                      return (
                        <tr
                          className="text-gray-700 dark:text-gray-400"
                          key={index}
                        >
                          <td className="px-4 py-3">{name}</td>
                          <td className="px-4 py-3 text-sm">{amount}</td>

                          <td className="px-4 py-3">
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
                    <td colSpan={3} className="px-4 py-3 text-sm ">
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

export default ExpensesTable;
