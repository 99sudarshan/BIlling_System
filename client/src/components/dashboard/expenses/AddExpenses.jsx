import React, { useEffect, useState } from "react";
import { CrossIcon } from "../../../assets/icons";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import LoadingRing from "../../common/LoadingRing";
import {
  addExpensesData,
  updateExpensesData,
} from "../../api/services/system/systemUserApiService";
import { expensesInput } from "./expensesInputs";

const AddExpenses = ({ tableData, closeModal }) => {
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
      dispatch(addExpensesData(data, setLoading, closeModal));
    } else {
      dispatch(updateExpensesData(tableData.id, data, setLoading, closeModal));
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
          Add Expenses
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {expensesInput.map((data, index) => {
            const { label, name, type, validation, placeholder } = data;
            return (
              <div key={index}>
                <div>
                  <label>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    {...register(name, validation)}
                  />
                  <p className="error"> {errors?.[name]?.message}</p>
                </div>
              </div>
            );
          })}
          <button className="button-style" disabled={loading}>
            {loading ? (
              <LoadingRing />
            ) : (
              <>{tableData.id === "" ? "Add Expenses" : "Update Expenses"}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenses;
