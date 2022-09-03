import axiosInstance from "../../axiosInstance";
import { errorToast, successToast } from "../../../common/toastifier/toastify";
import * as actions from "../../../../redux/actions/orderproductAction";

export const fetchMakeOrderData = () => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get(`/billing/`);
      dispatch(actions.addMakeOrderDetail(res.data));
    } catch (err) {
      console.log(err.response);
    }
  };
};

export const fetchMakeOrderDataByTableId = (id) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get(`/billing/order/edit/${id}`);
      dispatch(actions.addMakeOrderDetailByTableId(res.data));
    } catch (err) {
      console.log(err.response);
    }
  };
};

export const addItemToOrderItem = (slug, id) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`/billing/add-item-to-order-item/${slug}`);
      dispatch(fetchProductBycategory(id));
    } catch (err) {
      if (err.response === undefined) {
        errorToast("Internal server error.");
      } else {
        errorToast(err.response.data.message);
      }
    }
  };
};

export const editAddItemToOrderItem = (slug, id, cid) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(
        `billing/edit-add-item-to-order-item/${id}/${slug}`
      );
      dispatch(fetchProductBycategoryAndOrderId(cid, id));
    } catch (err) {
      if (err.response === undefined) {
        errorToast("Internal server error.");
      } else {
        errorToast(err.response.data.message);
      }
    }
  };
};

export const removeItemToOrderItem = (slug, id) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`/billing/remove-item-from-order-item/${slug}`);
      dispatch(fetchProductBycategory(id));
    } catch (err) {
      if (err.response === undefined) {
        errorToast("Internal server error.");
      } else {
        errorToast(err.response.data.message);
      }
    }
  };
};

export const editRemoveItemToOrderItem = (slug, id, cid) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(
        `billing/edit-remove-item-from-order-item/${id}/${slug}`
      );
      dispatch(fetchProductBycategoryAndOrderId(cid, id));
    } catch (err) {
      if (err.response === undefined) {
        errorToast("Internal server error.");
      } else {
        errorToast(err.response.data.message);
      }
    }
  };
};

export const makeOrder = (data, setCustomerInfo, setLoading, navigate) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`/billing/save-order-items`, data);
      dispatch(fetchMakeOrderData());
      setLoading(false);
      setCustomerInfo((preval) => ({
        ...preval,
        customer_name: "",
        customer_pan: "",
        table: "",
        payment_type: "unpaid",
        table_error: "",
        discount: "",
        recievedAmount: 0,
      }));
      successToast("Order added successfully");
      navigate("/dashboard/orders");
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

export const editMakeOrder = (
  id,
  data,
  setCustomerInfo,
  setLoading,
  navigate
) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`billing/edit-save-order-items/${id}`, data);
      dispatch(fetchMakeOrderData());
      setLoading(false);
      setCustomerInfo((preval) => ({
        ...preval,
        customer_name: "",
        customer_pan: "",
        table: "",
        payment_type: "unpaid",
        table_error: "",
        discount: "",
        recievedAmount: 0,
      }));
      successToast("Order updated successfully");
      navigate("/dashboard/orders");
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

export const editMakeOrderAndPrint = (
  id,
  data,
  setCustomerInfo,
  setLoading,
  navigate
) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`billing/edit-save-order-items/${id}`, data);
      dispatch(fetchMakeOrderDataByTableId(id));
      setLoading(false);
      setCustomerInfo((preval) => ({
        ...preval,
        customer_name: "",
        customer_pan: "",
        table: "",
        payment_type: "unpaid",
        table_error: "",
        discount: "",
        recievedAmount: 0,
      }));
      successToast("Order updated successfully");
      window.open(
        `/dashboard/print-report/${id}`,
        "_blank",
        "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=500,width=800,height=700"
      );
      setTimeout(() => {
        navigate("/dashboard/orders");
      }, 2000);
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

export const fetchProductBycategory = (id) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get(
        `/billing/get-product-by-category/${id}`
      );
      dispatch(actions.addProductByCategory({ ...res.data, category_id: id }));
    } catch (err) {
      console.log(err.response);
    }
  };
};

export const fetchProductBycategoryAndOrderId = (cid, order_id) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get(
        `billing/edit-get-product-by-category/${order_id}/${cid}`
      );
      dispatch(
        actions.addProductByCategoryAndOrderId({
          ...res.data,
          category_id: cid,
        })
      );
    } catch (err) {
      console.log(err.response);
    }
  };
};

export const fetchCurrentOrderData = async (setData) => {
  try {
    const res = await axiosInstance.get(`/billing/orders`);
    setData(res.data.orders);
  } catch (err) {
    console.log(err.response);
  }
};

export const deleteOrderData = (
  id,
  setData,
  setLoading,
  setOpenDeleteModal
) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`/billing/order/delete/${id}`);
      fetchCurrentOrderData(setData);
      setLoading(false);
      setOpenDeleteModal(false);
      successToast("Order deleted successfully");
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
