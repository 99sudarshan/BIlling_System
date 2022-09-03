import React, { useEffect, useState } from "react";
import { CrossIcon } from "../../../../assets/icons";
import { useForm } from "react-hook-form";
import LoadingRing from "../../../common/LoadingRing";
import { groupInputsFields } from "./groupinputs";
import { useDispatch, useSelector } from "react-redux";
import {
  addGroupData,
  updateGroupData,
} from "../../../api/services/system/systemUserApiService";

const AddGroup = ({ closeModal, groupData }) => {
  const [loading, setLoading] = useState(false);
  const { permissions } = useSelector((state) => state.systemUser);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    if (groupData.id === "") {
      dispatch(addGroupData(data, setLoading, closeModal));
    } else {
      dispatch(updateGroupData(groupData.id, data, setLoading, closeModal));
    }
  };
  useEffect(() => {
    if (groupData.id !== "") {
      const resetVal = {
        name: groupData.name,
      };
      reset(resetVal);
    }
    //eslint-disable-next-line
  }, [groupData]);
  return (
    <div>
      <div className="px-6 py-4 mb-8  h-fulldark:bg-gray-800">
        <header className="flex justify-end">
          <button
            className="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover: hover:text-gray-700"
            onClick={closeModal}
          >
            <CrossIcon className="w-4 h-4" />
          </button>
        </header>
        <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Add Group
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {groupInputsFields.map((data, index) => {
            const { label, name, type, validation, placeholder, options } =
              data;
            return (
              <div key={index}>
                {options ? (
                  <div>
                    <label>{label}</label>
                    <select
                      className="h-40"
                      defaultValue={groupData.id ? groupData.permissions : []}
                      {...register(name, validation)}
                      multiple
                    >
                      {permissions.map((data, index) => {
                        return (
                          <option value={data.id} key={index + 1}>
                            {data.name}
                          </option>
                        );
                      })}
                    </select>

                    <p className="error"> {errors?.[name]?.message}</p>
                  </div>
                ) : (
                  <div>
                    <label>{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      {...register(name, validation)}
                    />
                    <p className="error"> {errors?.[name]?.message}</p>
                  </div>
                )}
              </div>
            );
          })}
          <button className="button-style" disabled={loading}>
            {loading ? (
              <LoadingRing />
            ) : (
              <>{groupData.id === "" ? "Add Group" : "Update Group"}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGroup;
