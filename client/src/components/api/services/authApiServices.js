import axiosInstance from "../axiosInstance";
import { errorToast, successToast } from "../../common/toastifier/toastify";

export const handleLogin = async (data, navigate, setLoading) => {
  try {
    const res = await axiosInstance.post(`/login/`, data);
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    successToast("Logged in sucessfully.");
    navigate("/dashboard");
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
