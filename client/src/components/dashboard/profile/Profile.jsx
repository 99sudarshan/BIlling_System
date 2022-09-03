import React from "react";
import MainHeader from "../../common/MainHeader";

const Profile = () => {
  return (
    <div className="container">
      <MainHeader text="My Profile" />
      <div className=" grid px-6 mx-auto">
        <div className="w-full overflow-hidden rounded-lg shadow-xs">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-black-500 text-text-tertiary border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3 uppercase">First Name</th>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400"></td>
                </tr>
                <tr className="text-text-tertiary text-xs font-semibold tracking-wide text-left text-black-500 border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3 uppercase">Last Name</th>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400"></td>
                </tr>
                <tr className="text-text-tertiary text-xs font-semibold tracking-wide text-left text-black-500 border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3 uppercase">Username</th>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    intelzy
                  </td>
                </tr>
                <tr className="text-text-tertiary text-xs font-semibold tracking-wide text-left text-black-500 border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3 uppercase">Email</th>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    admin@gmail.com
                  </td>
                </tr>
                <tr className="text-text-tertiary text-xs font-semibold tracking-wide text-left border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3 uppercase">Group</th>
                  <td>
                    <span className="px-4 py-3 text-white rounded-md bg-blue-600">
                      Super Administrator
                    </span>
                  </td>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
