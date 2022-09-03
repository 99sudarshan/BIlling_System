import {
  SET_GROUP_DATA,
  SET_USER_DATA,
  SET_PERMISSIONS,
  SET_COMPANY_INFO,
  SET_TABLE_DATA,
  // SET_CATEGORY_DATA,
  SET_EXPENSES_DATA,
} from "../actions/actionsTypes";

const initialState = {
  user_list: [],
  group_list: [],
  permissions: [],
  company_info: {},
  table_list: [],
  expenses_list: [],
};

const systemUserReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_EXPENSES_DATA:
      return {
        ...state,
        expenses_list: payload,
      };
    case SET_TABLE_DATA:
      return {
        ...state,
        table_list: payload,
      };
    case SET_COMPANY_INFO:
      return {
        ...state,
        company_info: payload,
      };
    case SET_USER_DATA:
      return {
        ...state,
        user_list: payload,
      };
    case SET_GROUP_DATA:
      return {
        ...state,
        group_list: payload,
      };
    case SET_PERMISSIONS:
      return {
        ...state,
        permissions: payload,
      };
    default:
      return state;
  }
};

export default systemUserReducer;
