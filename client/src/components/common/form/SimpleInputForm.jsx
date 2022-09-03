import React, { useState } from "react";
import IconManager from "../IconManager";
export const SimpleInputForm = ({
  label,
  name,
  value,
  type,
  placeholder,
  after,
  handleChange,
  error,
  disable,
}) => {
  return (
    <div className={`mb-2 w-full`}>
      <div className={`${after && "after"} relative`}>
        <label htmlFor="">{label}</label>
        <input
          type={type}
          className={`after`}
          value={value}
          name={name}
          placeholder={placeholder}
          onChange={handleChange}
          disabled={disable}
          readOnly={disable}
        />
        {error && (
          <div className="error text-red-600 text-xs mt-1">{error}</div>
        )}
      </div>
    </div>
  );
};

export const SimmplePasswordForm = ({
  label,
  name,
  value,
  type,
  placeholder,
  after,
  handleChange,
  error,
  col,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={`${col} mb-2`}>
      <div className={`${after && "after"} relative`}>
        <label htmlFor="">{label}</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : type}
            className={`after`}
            value={value}
            name={name}
            placeholder={placeholder}
            onChange={handleChange}
          />
          <span
            className={`absolute bottom-2 2xl:bottom-3 ${
              showPassword ? "text-button" : "text-text-tertiary"
            }  right-3 cursor-pointer`}
            onClick={() => setShowPassword(!showPassword)}
          >
            <IconManager icon="showPassword" className="w-6 h-6" />
          </span>
        </div>
        {error && (
          <div className="error text-red-600 text-xs mt-1">{error}</div>
        )}
      </div>
    </div>
  );
};
