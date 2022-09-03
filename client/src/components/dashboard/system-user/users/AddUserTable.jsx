import React, { useState } from "react";
import { CrossIcon } from "../../../../assets/icons";
import { userInputsFields } from "./userInputFields";
import { useForm } from "react-hook-form";
import LoadingRing from "../../../common/LoadingRing";
import { useDispatch } from "react-redux";
import {
  addUserData,
  updateUserData,
} from "../../../api/services/system/systemUserApiService";
import { useEffect } from "react";

const AddUserTable = ({ closeModal, userData, group_list }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const { username, password, first_name, last_name, email, group } = data;
    setLoading(true);
    if (userData.id === "") {
      const formData = {
        username,
        password1: password,
        first_name,
        last_name,
        email,
        group: parseInt(group),
      };
      dispatch(addUserData(formData, setLoading, closeModal));
    } else {
      const formData = {
        username,
        first_name,
        last_name,
        email,
        group: parseInt(group),
      };
      dispatch(updateUserData(userData.id, formData, setLoading, closeModal));
    }
  };
  useEffect(() => {
    if (userData.id !== "") {
      reset({ ...userData, password: "11111111", cpassword: "11111111" });
    }
    //eslint-disable-next-line
  }, [userData]);
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
          Add User
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="">
          {userInputsFields.map((data, index) => {
            const {
              label,
              name,
              type,
              validation,
              placeholder,
              options,
              cpass,
            } = data;
            return (
              <div key={index}>
                {options ? (
                  <div>
                    <label>{label}</label>
                    <select {...register(name, validation)}>
                      {group_list.map((data, index) => {
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
                  <>
                    {cpass ? (
                      <div>
                        <label>{label}</label>
                        <input
                          type={type}
                          disabled={userData.id !== "" && true}
                          {...register(name, {
                            required: true,
                            validate: (val) => {
                              if (watch("password") !== val) {
                                return "Your passwords do not match";
                              }
                            },
                          })}
                        />
                        <p className="error"> {errors?.[name]?.message}</p>
                      </div>
                    ) : (
                      <div>
                        <label>{label}</label>
                        <input
                          type={type}
                          disabled={name === "password" && userData.id && true}
                          placeholder={
                            name === "password" && userData.id
                              ? "********"
                              : placeholder
                          }
                          {...register(name, validation)}
                        />
                        <p className="error"> {errors?.[name]?.message}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
          <button className="button-style" disabled={loading}>
            {loading ? (
              <LoadingRing />
            ) : (
              <>{userData.id === "" ? "Add User" : "Update User"}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserTable;
