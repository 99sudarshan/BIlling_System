import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../../api/services/authApiServices";
import LoadingRing from "../../common/LoadingRing";
import { inputsFields } from "./inputs";
const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    setLoading(true);
    handleLogin(data, navigate, setLoading);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      {inputsFields.map((data, index) => {
        const { label, name, type, validation, placeholder } = data;
        return (
          <div key={index}>
            <label>{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              {...register(name, validation)}
            />
            <p className="error"> {errors?.[name]?.message}</p>
          </div>
        );
      })}
      <button className="button-style" disabled={loading}>
        {loading ? <LoadingRing /> : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
