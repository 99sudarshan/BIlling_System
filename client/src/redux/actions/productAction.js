import { SET_PRODUCT_DATA, SET_CATEGORY_DATA } from "./actionsTypes";

export const setProductData = (data) => {
  return {
    type: SET_PRODUCT_DATA,
    payload: data,
  };
};

export const setCategoryData = (data) => {
  return {
    type: SET_CATEGORY_DATA,
    payload: data,
  };
};
