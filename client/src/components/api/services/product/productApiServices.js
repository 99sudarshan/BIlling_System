import axiosInstance from "../../axiosInstance";
import { errorToast, successToast } from "../../../common/toastifier/toastify";
import * as actions from "../../../../redux/actions/productAction";

// product
export const fetchProductData = () => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get(`/item/product`);
      dispatch(actions.setProductData(res.data.products));
    } catch (err) {
      console.log(err.response);
    }
  };
};

export const addProduct = (data, setLoading, closeModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`/item/product`, data);
      dispatch(fetchProductData());
      setLoading(false);
      closeModal();
      successToast("Product added successfully");
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

export const fetchProductDataById = async (id, data, setData) => {
  try {
    const res = await axiosInstance.get(`/item/product/edit/${id}`);
    const result = res.data.product;
    // console.log(result);
    setData({
      ...data,
      id: result.id,
      category_id: result.category,
      image: result.image,
      name: result.name,
      description: result.description,
      price: result.price,
      status: result.status,
    });
  } catch (err) {
    console.log(err.response);
  }
};

export const updateProductData = (id, data, setLoading, closeModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.patch(`/item/product/edit/${id}`, data);
      dispatch(fetchProductData());
      setLoading(false);
      closeModal();
      successToast("Product updated successfully");
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

export const deleteProductData = (id, setLoading, setOpenDeleteModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`/item/product/delete/${id}`);
      dispatch(fetchProductData());
      setLoading(false);
      setOpenDeleteModal(false);
      successToast("Product deleted successfully");
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

//category
export const fetchCategoryData = () => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get(`/item/category`);
      dispatch(actions.setCategoryData(res.data.categories));
    } catch (err) {
      console.log(err.response);
    }
  };
};

export const addCategoryData = (data, setLoading, closeModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`/item/category`, data);
      dispatch(fetchCategoryData());
      setLoading(false);
      closeModal();
      successToast("Category added successfully");
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

export const fetchCategoryDataById = async (id, data, setData) => {
  try {
    const res = await axiosInstance.get(`/item/category/edit/${id}`);
    const result = res.data.category;
    setData({
      ...data,
      id: result.id,
      name: result.name,
      status: result.status,
    });
  } catch (err) {
    console.log(err.response);
  }
};

export const updateCategoryData = (id, data, setLoading, closeModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.patch(`/item/category/edit/${id}`, data);
      dispatch(fetchCategoryData());
      setLoading(false);
      closeModal();
      successToast("Category updated successfully");
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

export const deleteCategoryData = (id, setLoading, setOpenDeleteModal) => {
  return async (dispatch) => {
    try {
      await axiosInstance.post(`/item/category/delete/${id}`);
      dispatch(fetchCategoryData());
      setLoading(false);
      setOpenDeleteModal(false);
      successToast("Category deleted successfully");
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
