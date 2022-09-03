import errorHandler from "../validation/error-handler";

export const dropdownHandeler = (
  data,
  dropdownList,
  inputs,
  setInputs,
  property,
  selectedProperty,
  errors,
  setErrors
) => {
  const error = { ...errors };
  error[property] = errorHandler([property], data);
  setErrors(error);
  let name = "";
  dropdownList.forEach((val) => {
    if (val.value === data) {
      name = val.name;
    }
  });
  setInputs({
    ...inputs,
    [property]: data,
    [selectedProperty]: name,
  });
};
