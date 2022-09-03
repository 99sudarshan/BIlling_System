import {
  ADD_MAKE_ORDER_DETAIL,
  REMOVE_ALL_PRODUCT_DATA,
  ADD_PRODUCT_BY_CATEGORY,
  ADD_MAKE_ORDER_DETAIL_BY_TABLE_ID,
  ADD_PRODUCT_BY_CATEGORY_AND_ORDER_ID,
} from "./actionsTypes";

export const addMakeOrderDetail = (data) => {
  return {
    type: ADD_MAKE_ORDER_DETAIL,
    payload: data,
  };
};

export const addMakeOrderDetailByTableId = (data) => {
  return {
    type: ADD_MAKE_ORDER_DETAIL_BY_TABLE_ID,
    payload: data,
  };
};

export const removeAllProductdata = () => {
  return {
    type: REMOVE_ALL_PRODUCT_DATA,
  };
};

export const addProductByCategory = (data) => {
  return {
    type: ADD_PRODUCT_BY_CATEGORY,
    payload: data,
  };
};
export const addProductByCategoryAndOrderId = (data) => {
  return {
    type: ADD_PRODUCT_BY_CATEGORY_AND_ORDER_ID,
    payload: data,
  };
};
