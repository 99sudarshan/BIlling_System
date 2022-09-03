import React from "react";
import { BackupIcon } from "../../../assets/icons";
import MainHeader from "../../common/MainHeader";

const Backup = () => {
  return (
    <div>
      <MainHeader text="Database Backup" />
      <div>
        <p className="text-text dark:text-gray-200 font-medium mb-4">
          Backup your data!
        </p>
        <span className="inline-flex items-center p-4 bg-background-lightGray text-text dark:text-gray-200  shadow-xs dark:bg-gray-800 border border-border-extraLight dark:border-gray-900 flex-col cursor-pointer animation transform hover:-translate-y-1">
          <div>
            <BackupIcon className="w-16 h-16" />
          </div>
          <p>Download Backup</p>
        </span>
      </div>
    </div>
  );
};

export default Backup;
