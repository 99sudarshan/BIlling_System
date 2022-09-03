import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { fetchActionLogData } from "../../api/services/system/systemUserApiService";
import MainHeader from "../../common/MainHeader";
import Pagination from "../../common/Pagination";

const ActionLog = () => {
  const [actionLogs, setActionLogs] = useState([]);
  const [value, setValue] = useState("");
  const listsPerPage = 10;
  const [page, setPage] = useState(4);
  const [currentButton, setCurrentButton] = useState(1);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const paginatedData = useMemo(() => {
    let computedData = actionLogs;
    setPage(Math.ceil(computedData.length / listsPerPage));
    return computedData;
    // eslint-disable-next-line
  }, [actionLogs]);

  //Get current lists
  const indexOfLastPost = currentButton * listsPerPage;
  const indexOfFirstPost = indexOfLastPost - listsPerPage;

  const currentActivityLists = paginatedData.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  useEffect(() => {
    fetchActionLogData(setActionLogs);
  }, []);

  return (
    <div>
      <MainHeader text="Action Logs" />
      <div className="flex justify-end items-center mb-3">
        <div className="flex items-center gap-2">
          <label htmlFor="">Search:</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>
      {/* <!-- Table --> */}
      <div className="w-full overflow-hidden  shadow">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-xs font-semibold bg-gray-600 text-white tracking-wide text-left uppercase border-b dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Table</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Actions</th>
                <th className="px-4 py-3">Date Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {actionLogs?.length > 0 ? (
                <>
                  {currentActivityLists
                    .filter((data) => {
                      if (value === "") return true;
                      if (
                        data.user.username
                          .toLowerCase()
                          .includes(value.toLowerCase()) ||
                        data.content_type
                          .toLowerCase()
                          .includes(value.toLowerCase()) ||
                        data.object_repr
                          .toLowerCase()
                          .includes(value.toLowerCase()) ||
                        new Date(data.date_time)
                          .toLocaleTimeString(undefined, options)
                          .toLowerCase()
                          .includes(value.toLowerCase())
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    })
                    .map((data, index) => {
                      const {
                        user,
                        content_type,
                        object_repr,
                        date_time,
                        action,
                      } = data;
                      return (
                        <tr
                          className="text-gray-700 dark:text-gray-400"
                          key={index}
                        >
                          <td className="px-4 py-3 text-sm">
                            {user?.username}
                          </td>
                          <td className="px-4 py-3 text-sm">{content_type}</td>
                          <td className="px-4 py-3 text-xs">{object_repr}</td>
                          <td className="px-4 py-3 text-xs">
                            {action === 1 && (
                              <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                                Added
                              </span>
                            )}
                            {action === 2 && (
                              <span className="px-2 py-1 font-semibold leading-tight text-yellow-700 bg-yellow-100 rounded-full dark:text-yellow-100 dark:bg-yellow-700">
                                Changed
                              </span>
                            )}
                            {action === 3 && (
                              <span className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-700">
                                Deleted
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {" "}
                            {new Date(date_time).toLocaleTimeString(
                              undefined,
                              options
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </>
              ) : (
                <tr className="text-gray-700 dark:text-gray-400">
                  <td colSpan={5} className="px-4 py-3 text-sm ">
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
      {actionLogs.length > listsPerPage && (
        <div className="flex justify-end mt-5">
          <Pagination
            setCurrentButton={setCurrentButton}
            currentButton={currentButton}
            page={page}
          />
        </div>
      )}
    </div>
  );
};

export default ActionLog;
