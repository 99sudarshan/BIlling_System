import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import App from "./App";
import DashboardManagement from "./dashboard/DashboardManagement";
import { ToastContainer } from "react-toastify";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { setDarkMode } from "../redux/actions/action";

function UrlDasWebmgnr() {
  const dispatch = useDispatch();
  const { dark_mode } = useSelector((state) => state.darkMode);
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setloggedIn] = useState(false);
  const [pageIsRendered, setPageIsRendered] = useState(false);
  const tokenManager = () => {
    const token = localStorage.getItem("refresh_token");
    let decoded;
    try {
      decoded = jwt_decode(token);
      const loggedIn = decoded && decoded.exp && decoded.user_id && true;
      if (loggedIn) {
        if (Date.now() > decoded.exp * 1000) {
          setloggedIn(false);
          localStorage.clear();
          navigate("/");
        } else {
          setloggedIn(true);
        }
      } else {
        navigate("/");
        localStorage.clear();
      }
    } catch (e) {
      setloggedIn(false);
    }
    setPageIsRendered(true);
  };

  useEffect(() => {
    const dark = localStorage.getItem("theme");
    tokenManager();
    dispatch(setDarkMode(dark === "dark" ? true : false));
    // eslint-disable-next-line
  }, [location]);
  return (
    <div className={`relative font-inter ${dark_mode ? "dark" : ""}`}>
      <ToastContainer />
      {pageIsRendered && (
        <Routes>
          {!loggedIn && (
            <Route path="/*" element={<App loggedIn={loggedIn} />} />
          )}
          {loggedIn && (
            <Route
              path="/dashboard/*"
              element={<DashboardManagement loggedIn={loggedIn} />}
            />
          )}
          <Route
            path="*"
            element={
              loggedIn ? (
                <Navigate replace to="/dashboard" />
              ) : (
                <Navigate replace to="/" />
              )
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default UrlDasWebmgnr;
