import React from "react";
import { TrashIcon } from "../../assets/icons";
import LoadingRing from "./LoadingRing";

const DeleteCard = ({ name, closeModal, deleteData, loading }) => {
  return (
    <div className=" p-4 dark:bg-gray-800">
      <div className="w-full h-full text-center">
        <div className="flex h-full flex-col justify-center">
          <TrashIcon className="h-12 w-12 mx-auto" />
          <p className="text-gray-800 dark:text-gray-200 text-xl font-bold mt-4">
            Remove {name}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-xs py-2 px-6">
            Are you sure you want to delete this {name} ?
          </p>
          <div className="flex items-center justify-between gap-4 w-full mt-8">
            <button className="button-style" onClick={deleteData}>
              {loading ? <LoadingRing /> : "Delete"}
            </button>
            <button className="button-style" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCard;
