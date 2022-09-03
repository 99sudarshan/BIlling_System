import { HANDLE_DARK_MODE } from "./actionsTypes";

export const setDarkMode = (data) => {
  return {
    type: HANDLE_DARK_MODE,
    payload: data,
  };
};
