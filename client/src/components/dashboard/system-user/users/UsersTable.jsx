import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditIcon, PlusIcon, TrashIcon } from "../../../../assets/icons";
import {
  deleteUserData,
  fetchGroupData,
  fetchUserData,
  fetchUserDataById,
} from "../../../api/services/system/systemUserApiService";
import CommonPopup from "../../../common/CommonPopup";
import DeleteCard from "../../../common/DeleteCard";
import MainHeader from "../../../common/MainHeader";
import AddUserTable from "./AddUserTable";

const UsersTable = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({
    id: "",
    cpassword: "",
    email: "",
    first_name: "",
    group: "",
    last_name: "",
    password: "",
    username: "",
  });
  const { group_list, user_list } = useSelector((state) => state.systemUser);
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
      deleteUserData(selectedItem.id, setIsDeleting, setOpenDeleteModal)
    );
  };

  const fetchUserDataByID = (id) => {
    fetchUserDataById(id, userData, setUserData);
    setOpen(true);
  };

  useEffect(() => {
    group_list.length === 0 && dispatch(fetchGroupData());
    dispatch(fetchUserData());
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
          setUserData({
            ...userData,
            id: "",
            cpassword: "",
            email: "",
            first_name: "",
            group: "",
            last_name: "",
            password: "",
            username: "",
          });
        }}
        width="max-w-xl"
      >
        <AddUserTable
          closeModal={() => {
            setOpen(false);
            setUserData({
              ...userData,
              id: "",
              cpassword: "",
              email: "",
              first_name: "",
              group: "",
              last_name: "",
              password: "",
              username: "",
            });
          }}
          userData={userData}
          group_list={group_list}
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
                  <th className="px-4 py-3">username</th>
                  <th className="px-4 py-3">email</th>
                  <th className="px-4 py-3">First Name</th>
                  <th className="px-4 py-3">Last Name</th>
                  <th className="px-4 py-3">Group</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {user_list.length > 0 ? (
                  <>
                    {user_list.map((data, index) => {
                      const {
                        username,
                        email,
                        first_name,
                        last_name,
                        is_superuser,
                        groups,
                        id,
                      } = data;
                      return (
                        <tr
                          className="text-gray-700 dark:text-gray-400"
                          key={index}
                        >
                          <td className="px-4 py-3">{username}</td>
                          <td className="px-4 py-3 text-sm">{email}</td>
                          <td className="px-4 py-3 text-sm">{first_name}</td>
                          <td className="px-4 py-3 text-xs">{last_name}</td>
                          <td className="px-4 py-3 text-sm">
                            {groups.length > 0 && groups[0].name}
                          </td>
                          <td className="px-4 py-3">
                            {!is_superuser && (
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center gap-4">
                                  <button
                                    className="flex items-center gap-1 bg-background-lightGray text-sm rounded px-1 py-1 hover:text-blue-500 
                          font-semibold hover:bg-blue-100 animation dark:bg-gray-900 dark:text-gray-400 dark:hover:text-blue-500 dark:hover:bg-blue-100"
                                    onClick={() => {
                                      fetchUserDataByID(id);
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
                                        name: username,
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
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <tr className="text-gray-700 dark:text-gray-400">
                    <td colSpan={6} className="px-4 py-3 text-sm ">
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

export default UsersTable;
