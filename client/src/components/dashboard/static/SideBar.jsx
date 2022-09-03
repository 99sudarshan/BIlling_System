import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DropdownIcon } from "../../../assets/icons";
import CustomLink from "../../common/CustomLink";
import { routes } from "./routes";

const SideBar = ({
  mobile,
  isToggle,
  toggle,
  setToggleSideBar,
  toggleSidebar,
}) => {
  const [width, setWidth] = useState(window.innerWidth);
  const nav = window.location.pathname;
  const [activeIndex, setActiveIndex] = useState("");

  const handleDropdown = (ind) => {
    if (ind !== "stop") {
      if (ind === activeIndex) {
        setActiveIndex("");
      } else {
        setActiveIndex(ind);
      }
    }
  };

  useEffect(() => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].subMenu) {
        for (let j = 0; j < routes[i].subMenu.length; j++) {
          if (nav === routes[i].subMenu[j].path) {
            setActiveIndex(i);
          }
        }
      }
    }
  }, [nav]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  });
  
  return (
    <aside
      className={` ${!mobile ? "hidden" : "pt-16"} ${
        isToggle && !mobile ? "w-[5rem]" : "w-64"
      } animation overflow-y-auto category h-full bg-background-lightGray dark:bg-gray-800 xl:block flex-shrink-0`}
      style={{
        zIndex: 1000,
      }}
    >
      <div className="py-4 text-gray-500 dark:text-gray-400">
        <div className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200">
          Windmill
        </div>
        <div className="mt-6">
          {routes.map((data, index) => {
            const { icon, path, title, subMenu } = data;
            return (
              <div key={index}>
                {!subMenu ? (
                  <CustomLink
                    to={path}
                    setIndex={() => {
                      setToggleSideBar(!toggleSidebar);
                      handleDropdown(index);
                    }}
                    index={index}
                    activeIndex={activeIndex}
                  >
                    {icon}
                    {!isToggle && <span className="ml-4">{title}</span>}
                  </CustomLink>
                ) : (
                  <>
                    <div className="relative cursor-pointer">
                      {activeIndex === index && (
                        <span className="absolute inset-y-0 left-0 w-1 bg-gray-600 rounded-tr-lg rounded-br-lg"></span>
                      )}
                      <div
                        className={` sidebar-item justify-between`}
                        onClick={() => {
                          handleDropdown(index);
                          toggle();
                        }}
                      >
                        <div className="flex items-center">
                          {icon}
                          {!isToggle && <span className="ml-4">{title}</span>}
                        </div>
                        <DropdownIcon
                          className={`h-5 w-5 animation transform ${
                            activeIndex === index ? "-rotate-180" : "rotate-0"
                          }`}
                        />
                      </div>
                    </div>
                    <div
                      className={`px-6  overflow-hidden animation ${
                        activeIndex === index && !isToggle
                          ? "max-h-32"
                          : "max-h-0"
                      }`}
                    >
                      <ul
                        className={`p-2 flex flex-col  mt-2 space-y-2 text-sm font-medium text-gray-500  shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900  `}
                      >
                        {subMenu.map((data, index) => {
                          const { path, name } = data;
                          return (
                            <Link
                              to={path}
                              key={index + 1}
                              className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                              onClick={() =>
                                mobile
                                  ? setToggleSideBar(!toggleSidebar)
                                  : toggle()
                              }
                            >
                              {name}
                            </Link>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-6 my-6">
          <Link
            to={`${
              width < 1024
                ? "/dashboard/make-orders-staff"
                : "/dashboard/make-orders"
            }`}
            className="button-style gap-2"
            onClick={() =>
              mobile ? setToggleSideBar(!toggleSidebar) : toggle()
            }
          >
            {!isToggle && <span>Make Order</span>}
            <span className="">+</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
