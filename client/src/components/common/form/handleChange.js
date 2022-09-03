import errorHandler from "../validation/error-handler";

export const handleInputsChange = (
  property,
  value,
  inputs,
  setInputs,
  errors,
  setErrors
) => {
  const error = { ...errors };
  error[property] = errorHandler(property, value);
  setErrors(error);
  setInputs({
    ...inputs,
    [property]: value,
  });
};
