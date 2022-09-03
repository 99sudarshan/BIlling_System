import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  LogoutIcon,
  MenuIcon,
  MoonIcon,
  ProfileIcon,
  SunIcon,
} from "../../../assets/icons";
import { setDarkMode } from "../../../redux/actions/action";
import SideBar from "./SideBar";

const NavBar = ({ toggle, isToggle }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [profileDropDown, setProfileDropDown] = useState(false);
  const [toggleSidebar, setToggleSideBar] = useState(false);
  const dispatch = useDispatch();
  const { dark_mode } = useSelector((state) => state.darkMode);

  const [time, setTime] = useState(new Date().toLocaleTimeString());
  setTimeout(() => {
    setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
  });

  const handleWidth = () => {
    const innerWidth = window.innerWidth;
    if (innerWidth > 1279 && width < 1280) {
      setWidth(innerWidth);
    } else if (innerWidth < 1280 && width > 1279) {
      setWidth(innerWidth);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleWidth);
    return () => {
      window.removeEventListener("resize", handleWidth);
    };
  });
  return (
    <>
      {width < 1280 && (
        <div
          className={`fixed top-0 left-0 transform ${
            toggleSidebar ? "w-full h-screen z-[10]" : "z-[-1]"
          } `}
        >
          <div className={`w-full h-full  relative`}>
            {toggleSidebar && (
              <div
                className={`absolute w-full h-full top-0 animation bg-black opacity-20`}
              ></div>
            )}
            <div
              className={`w-full h-full animation ${
                toggleSidebar ? "-translate-x-0" : "-translate-x-64"
              }`}
            >
              <SideBar
                mobile={true}
                setToggleSideBar={setToggleSideBar}
                toggle={() => {}}
                toggleSidebar={toggleSidebar}
              />
            </div>
          </div>
        </div>
      )}
      <header className="z-10 py-4 bg-background-lightGray dark:bg-gray-800 flex items-center">
        <button className="p-1 focus:outline-none focus:shadow-outline-gray dark:text-gray-300 ml-5">
          {/* menu icon  */}
          <div
            className="cursor-pointer"
            onClick={() => {
              toggle(!isToggle);
              setToggleSideBar(!toggleSidebar);
            }}
          >
            <MenuIcon className="w-8 h-8" />
          </div>
        </button>
        <div className="container flex items-center  justify-between h-full px-6 mx-auto text-gray-600 dark:text-gray-300">
          <div className="flex justify-end sm:!justify-between items-center flex-1">
            <div className="relative hidden sm:block w-full max-w-xl mr-6 focus-within:text-gray-500 ">
              <div className="font-bold text-right">{time}</div>
            </div>
            <ul className="flex items-center flex-shrink-0 space-x-6">
              <li className="flex">
                <button
                  className=" focus:outline-none focus:outline-gray-500"
                  onClick={() => {
                    dispatch(setDarkMode(!dark_mode));
                    localStorage.getItem("theme") === "dark"
                      ? localStorage.removeItem("theme")
                      : localStorage.setItem("theme", "dark");
                  }}
                >
                  {dark_mode ? (
                    <SunIcon className="w-5 h-5" />
                  ) : (
                    <MoonIcon className="w-5 h-5" />
                  )}
                </button>
              </li>
              <li className="relative">
                <span className="font-medium mr-2">Intelzy</span>
                <button
                  className="align-middle  focus:shadow-outline-gray focus:outline-none"
                  onClick={() => setProfileDropDown(!profileDropDown)}
                >
                  <img
                    className="w-10 h-10 object-cover rounded-full"
                    src="https://images.unsplash.com/photo-1617943133078-3ad4f4411aeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                    alt="Mahol Cafe &amp; Restaurant"
                  />
                </button>
                {profileDropDown && (
                  <div>
                    <div
                      className=" w-screen h-screen fixed top-0 right-0"
                      onClick={() => setProfileDropDown(!profileDropDown)}
                    ></div>
                    <ul className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100  shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700">
                      <li className="flex">
                        <Link
                          to="/dashboard/profile"
                          className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150  hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                        >
                          <ProfileIcon className="w-5 h-5" />
                          <span>Profile</span>
                        </Link>
                      </li>
                      <li className="flex">
                        <button
                          className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150  hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                          onClick={() => {
                            localStorage.clear();
                            window.location = "/";
                          }}
                        >
                          <LogoutIcon className="w-5 h-5" />
                          <span>Log out</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
};

export default NavBar;
