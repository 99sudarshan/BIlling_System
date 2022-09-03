import axiosInstance from "../../axiosInstance";
import { errorToast, successToast } from "../../../common/toastifier/toastify";
import * as actions from "../../../../redux/actions/systemUserActions";

//user
export const fetchUserData = () => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get(`/auth/users`);
      dispatch(actions.setSystemUserData(res.data.users));
    } catch (err) {
      console.log(err.response);
    }
  };
};

export const addUserData = (data, setLoading, closeModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`/auth/users/`, data);
      dispatch(fetchUserData());
      setLoading(false);
      closeModal();
      successToast("user added successfully");
    } catch (err) {
      setLoading(false);
      if (err.response === undefined) {
        errorToast("Internal server error.");
      } else {
        errorToast(err.response.data.message);
      }
    }
  };
};

export const fetchUserDataById = async (id, data, setData) => {
  try {
    const res = await axiosInstance.get(`/auth/user/edit/${id}`);
    const result = res.data.user;
    // console.log(result);
    setData({
      ...data,
      id: result.id,
      cpassword: "",
      email: result.email,
      first_name: result.first_name,
      group: result.groups[0],
      last_name: result.last_name,
      password: "",
      username: result.username,
    });
  } catch (err) {
    console.log(err.response);
  }
};

export const updateUserData = (id, data, setLoading, closeModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.patch(`/auth/user/edit/${id}`, data);
      dispatch(fetchUserData());
      setLoading(false);
      closeModal();
      successToast("user updated successfully");
    } catch (err) {
      setLoading(false);
      if (err.response === undefined) {
        errorToast("Internal server error.");
      } else {
        errorToast(err.response.data.message);
      }
    }
  };
};

export const deleteUserData = (id, setLoading, setOpenDeleteModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`/auth/user/delete/${id}`);
      dispatch(fetchUserData());
      setLoading(false);
      setOpenDeleteModal(false);
      successToast("User deleted successfully");
    } catch (err) {
      setLoading(false);
      if (err.response === undefined) {
        errorToast("Internal server error.");
      } else {
        errorToast(err.response.data.message);
      }
    }
  };
};

// company info
export const fetchCompanyInfo = () => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get(`/company_info`);
      dispatch(actions.setCompanyInfo(res.data.company_info));
    } catch (err) {
      console.log(err.response);
    }
  };
};

// table
export const fetchTableData = () => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get(`/table`);
      dispatch(actions.setTableInfo(res.data.tables));
    } catch (err) {
      console.log(err.response);
    }
  };
};

export const addTableData = (data, setLoading, closeModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`/table/`, data);
      dispatch(fetchTableData());
      setLoading(false);
      closeModal();
      successToast("Table added successfully");
    } catch (err) {
      setLoading(false);
      if (err.response === undefined) {
        errorToast("Internal server error.");
      } else {
        errorToast(err.response.data.message);
      }
    }
  };
};

export const fetchTableDataById = async (id, data, setData) => {
  try {
    const res = await axiosInstance.get(`/table/edit/${id}`);
    const result = res.data.table;
    setData({
      ...data,
      id: result.id,
      name: result.name,
      capacity: result.capacity,
      status: result.status,
    });
  } catch (err) {
    console.log(err.response);
  }
};

export const updateTableData = (id, data, setLoading, closeModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.patch(`/table/edit/${id}`, data);
      dispatch(fetchTableData());
      setLoading(false);
      closeModal();
      successToast("Table updated successfully");
    } catch (err) {
      setLoading(false);
      if (err.response === undefined) {
        errorToast("Internal server error.");
      } else {
        errorToast(err.response.data.message);
      }
    }
  };
};

export const deleteTableData = (id, setLoading, setOpenDeleteModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`/table/delete/${id}`);
      dispatch(fetchTableData());
      setLoading(false);
      setOpenDeleteModal(false);
      successToast("Table deleted successfully");
    } catch (err) {
      setLoading(false);
      if (err.response === undefined) {
        errorToast("Internal server error.");
      } else {
        errorToast(err.response.data.message);
      }
    }
  };
};

// group
export const fetchGroupData = () => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get(`/auth/groups`);
      dispatch(actions.setSystemGroupData(res.data.groups));
      dispatch(actions.setPermissions(res.data.permissions));
    } catch (err) {
      console.log(err.response);
    }
  };
};

export const addGroupData = (data, setLoading, closeModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`/auth/groups/`, data);
      dispatch(fetchGroupData());
      setLoading(false);
      closeModal();
      successToast("Group added successfully");
    } catch (err) {
      setLoading(false);
      if (err.response === undefined) {
        errorToast("Internal server error.");
      } else {
        errorToast(err.response.data.message);
      }
    }
  };
};

export const fetchGroupDataById = async (id, data, setData) => {
  try {
    const res = await axiosInstance.get(`/auth/group/edit/${id}`);
    const result = res.data.group;
    setData({
      ...data,
      id: result.id,
      name: result.name,
      permissions: result.permissions,
    });
  } catch (err) {
    console.log(err.response);
  }
};

export const updateGroupData = (id, data, setLoading, closeModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.patch(`/auth/group/edit/${id}`, data);
      dispatch(fetchGroupData());
      setLoading(false);
      closeModal();
      successToast("Group updated successfully");
    } catch (err) {
      setLoading(false);
      if (err.response === undefined) {
        errorToast("Internal server error.");
      } else {
        errorToast(err.response.data.message);
      }
    }
  };
};

export const deleteGroupData = (id, setLoading, setOpenDeleteModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`/auth/group/delete/${id}`);
      dispatch(fetchGroupData());
      setLoading(false);
      setOpenDeleteModal(false);
      successToast("Group deleted successfully");
    } catch (err) {
      setLoading(false);
      if (err.response === undefined) {
        errorToast("Internal server error.");
      } else {
        errorToast(err.response.data.message);
      }
    }
  };
};

//action log
export const fetchActionLogData = async (setData) => {
  try {
    const res = await axiosInstance.get(`action_log`);
    setData(res.data.action_logs);
  } catch (err) {
    if (err.response === undefined) {
      errorToast("Internal server error.");
    }
  }
};

// expenses
export const fetchExpensesData = () => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get(`/expenses`);
      dispatch(actions.setExpensesData(res.data.expenses));
    } catch (err) {
      console.log(err.response);
    }
  };
};

export const addExpensesData = (data, setLoading, closeModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`/expenses/`, data);
      dispatch(fetchExpensesData());
      setLoading(false);
      closeModal();
      successToast("Expenses added successfully");
    } catch (err) {
      setLoading(false);
      if (err.response === undefined) {
        errorToast("Internal server error.");
      } else {
        errorToast(err.response.data.message);
      }
    }
  };
};

export const fetchExpensesDataById = async (id, data, setData) => {
  try {
    const res = await axiosInstance.get(`/expenses/edit/${id}`);
    const result = res.data.expense;
    setData({
      ...data,
      id: result.id,
      name: result.name,
      amount: result.amount,
    });
  } catch (err) {
    console.log(err.response);
  }
};

export const updateExpensesData = (id, data, setLoading, closeModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.patch(`/expenses/edit/${id}`, data);
      dispatch(fetchExpensesData());
      setLoading(false);
      closeModal();
      successToast("Expenses updated successfully");
    } catch (err) {
      setLoading(false);
      if (err.response === undefined) {
        errorToast("Internal server error.");
      } else {
        errorToast(err.response.data.message);
      }
    }
  };
};

export const deleteExpensesData = (id, setLoading, setOpenDeleteModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`/expenses/delete/${id}`);
      dispatch(fetchExpensesData());
      setLoading(false);
      setOpenDeleteModal(false);
      successToast("Expenses deleted successfully");
    } catch (err) {
      setLoading(false);
      if (err.response === undefined) {
        errorToast("Internal server error.");
      } else {
        errorToast(err.response.data.message);
      }
    }
  };
};

//reports
export const fetchAllReprts = async (type, setData) => {
  try {
    const res = await axiosInstance.get(`/billing/total-report/${type}`);
    setData(res.data.all_orders);
  } catch (err) {
    console.log(err.response);
  }
};

export const fetchProductWiseReport = async (slug, type, setData) => {
  try {
    const res = await axiosInstance.get(
      `billing/product-report/${slug}/${type}`
    );
    setData(res.data.all_orders);
  } catch (err) {
    console.log(err.response);
  }
};

export const fetchAuditTrailReport = async (setData, setInfo) => {
  try {
    const res = await axiosInstance.get(`/billing/report`);
    setData(res.data.all_orders);
    setInfo(res.data.company_info);
  } catch (err) {
    console.log(err.response);
  }
};

//sales return
export const fetchSalesReturnData = async (setData, setCompanyInfo) => {
  try {
    const res = await axiosInstance.get(`/billing/sales-return`);
    // console.log(res.data);
    setData(res.data.bills);
    setCompanyInfo(res.data.company_info);
  } catch (err) {
    console.log(err.response);
  }
};

export const addSalesReturn = async (
  data,
  id,
  setData,
  setCompanyInfo,
  closeModal,
  setLoading
) => {
  try {
    await axiosInstance.post(`/billing/sales-return/${id}`, data);
    fetchSalesReturnData(setData, setCompanyInfo);
    closeModal();
    setLoading(false);
  } catch (err) {
    setLoading(false);
    if (err.response === undefined) {
      errorToast("Internal server error.");
    } else {
      errorToast(err.response.data.message);
    }
  }
};

export const fetchSalesReturnReport = async (setData, setCompanyInfo) => {
  try {
    const res = await axiosInstance.get(`/billing/sales-return-report/`);
    setCompanyInfo(res.data.company_info);
    setData(res.data.sales_returns);
  } catch (err) {
    console.log(err.response);
  }
};

export const fetchOrderroperyById = (id, setData) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get(`/billing/get-order-report/${id}`);
      setData(res.data.order);
      dispatch(fetchCompanyInfo());
    } catch (err) {
      console.log(err.response);
    }
  };
};
