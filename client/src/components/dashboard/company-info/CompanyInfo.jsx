import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditIcon, TrashIcon } from "../../../assets/icons";
import { baseURL } from "../../api/axiosInstance";
import { fetchCompanyInfo } from "../../api/services/system/systemUserApiService";
import MainHeader from "../../common/MainHeader";

const CompanyInfo = () => {
  const { company_info } = useSelector((state) => state.systemUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompanyInfo());
    //eslint-disable-next-line
  }, []);
  return (
    <div>
      <MainHeader text="Company Info" />
      {/* <!-- Table --> */}
      <div className="w-full overflow-hidden  shadow">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-xs font-semibold bg-gray-600 text-white tracking-wide text-left uppercase border-b dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">Logo</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Fiscal Year</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {company_info.length > 0 ? (
                <>
                  {company_info.map((data, index) => {
                    const { logo, name, fiscal_year, address, phone } = data;
                    return (
                      <tr
                        className="text-gray-700 dark:text-gray-400"
                        key={index}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center text-sm">
                            {/* <!-- Avatar with inset shadow --> */}
                            <div className="relative hidden w-8 h-8 mr-3  md:block">
                              <img
                                className="object-cover w-full h-full rounded-full"
                                src={`${baseURL}${logo}`}
                                alt=""
                              />
                              <div className="absolute inset-0  shadow-inner"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{name}</td>
                        <td className="px-4 py-3 text-sm">{fiscal_year}</td>
                        <td className="px-4 py-3 text-xs">{address}</td>
                        <td className="px-4 py-3 text-sm">{phone}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center gap-4">
                              <button
                                className="flex items-center gap-1 bg-background-lightGray text-sm rounded px-1 py-1 hover:text-blue-500 
                      font-semibold hover:bg-blue-100 animation dark:bg-gray-900 dark:text-gray-400 dark:hover:text-blue-500 dark:hover:bg-blue-100"
                              >
                                <EditIcon className="w-5 h-5" />
                                <span>Edit</span>
                              </button>
                              <button
                                className="flex items-center gap-1 bg-background-lightGray text-sm rounded px-1 py-1 hover:text-red-500 
                      font-semibold hover:bg-red-100 animation dark:bg-gray-900 dark:text-gray-400 
                      dark:hover:text-red-500 dark:hover:bg-red-100"
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
  );
};

export default CompanyInfo;
