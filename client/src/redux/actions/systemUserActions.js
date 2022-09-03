import {
  SET_GROUP_DATA,
  SET_USER_DATA,
  SET_PERMISSIONS,
  SET_COMPANY_INFO,
  SET_TABLE_DATA,
  SET_EXPENSES_DATA,
} from "./actionsTypes";

export const setExpensesData = (data) => {
  return {
    type: SET_EXPENSES_DATA,
    payload: data,
  };
};

export const setSystemUserData = (data) => {
  return {
    type: SET_USER_DATA,
    payload: data,
  };
};

export const setSystemGroupData = (data) => {
  return {
    type: SET_GROUP_DATA,
    payload: data,
  };
};

export const setPermissions = (data) => {
  return {
    type: SET_PERMISSIONS,
    payload: data,
  };
};

export const setCompanyInfo = (data) => {
  return {
    type: SET_COMPANY_INFO,
    payload: data,
  };
};

export const setTableInfo = (data) => {
  return {
    type: SET_TABLE_DATA,
    payload: data,
  };
};
