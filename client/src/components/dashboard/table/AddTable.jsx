import React, { useEffect, useState } from "react";
import { CrossIcon } from "../../../assets/icons";
import { useForm } from "react-hook-form";
import { tableInputs } from "./tableInputs";
import { useDispatch } from "react-redux";
import LoadingRing from "../../common/LoadingRing";
import {
  addTableData,
  updateTableData,
} from "../../api/services/system/systemUserApiService";

const AddTable = ({ tableData, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    if (tableData.id === "") {
      dispatch(addTableData(data, setLoading, closeModal));
    } else {
      dispatch(updateTableData(tableData.id, data, setLoading, closeModal));
    }
  };
  useEffect(() => {
    if (tableData.id !== "") {
      reset(tableData);
    }
    //eslint-disable-next-line
  }, [tableData]);
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
          Add Table
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {tableInputs.map((data, index) => {
            const { label, name, type, validation, placeholder, options } =
              data;
            return (
              <div key={index}>
                {options ? (
                  <div>
                    <label>{label}</label>
                    <select
                      defaultValue={tableData.id ? tableData.status : 1}
                      {...register(name, validation)}
                    >
                      {options.map((data, index) => {
                        return (
                          <option value={data.value} key={index + 1}>
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
              <>{tableData.id === "" ? "Add Table" : "Update Table"}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTable;
