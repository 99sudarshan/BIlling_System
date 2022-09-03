import { SET_PRODUCT_DATA, SET_CATEGORY_DATA } from "../actions/actionsTypes";

const initialState = {
  product_list: [],
  category_list: [],
};
const productReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_CATEGORY_DATA:
      return {
        ...state,
        category_list: payload,
      };
    case SET_PRODUCT_DATA:
      return {
        ...state,
        product_list: payload,
      };
    default:
      return state;
  }
};

export default productReducer;
