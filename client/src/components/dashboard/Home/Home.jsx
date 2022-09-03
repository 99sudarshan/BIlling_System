import React from "react";
import {
  CartIcon,
  MessageIcon,
  MoneyIcon,
  PeopleIcon,
} from "../../../assets/icons";
import MainHeader from "../../common/MainHeader";
import BarGraph from "./integrate/BarGraph";
import LineGraph from "./integrate/LineGraph";

function Home() {
  const cards = [
    {
      component: <PeopleIcon className="w-5 h-5" />,
      title: "System Users",
      count: "6389",
      css: "p-3 mr-4 text-orange-500 bg-orange-100  dark:text-orange-100 dark:bg-orange-500",
    },
    {
      component: <CartIcon className="w-5 h-5" />,
      title: "Total Products",
      count: "6389",
      css: "p-3 mr-4 text-green-500 bg-green-100  dark:text-green-100 dark:bg-green-500",
    },
    {
      component: <MessageIcon className="w-5 h-5" />,
      title: "Today Orders",
      count: "6389",
      css: "p-3 mr-4 text-blue-500 bg-blue-100  dark:text-blue-100 dark:bg-blue-500",
    },
    {
      component: <MoneyIcon className="w-5 h-5" />,
      title: "Today Sales",
      count: "6389",
      css: "p-3 mr-4 text-teal-500 bg-teal-100  dark:text-teal-100 dark:bg-teal-500",
    },
  ];
  return (
    <div>
      <MainHeader text="Dashboard" />
      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((data, index) => {
          const { component, title, count, css } = data;
          return (
            <div
              className="flex items-center p-4 bg-background-lightGray  shadow-xs dark:bg-gray-800 border border-border-extraLight dark:border-gray-900"
              key={index}
            >
              <div className={css}>{component}</div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {title}
                </p>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {count}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {/* graph  */}
      <MainHeader text="Charts" />
      <div className="md:flex gap-10 justify-between space-y-5 md:space-y-0">
        <div className="flex-1 p-4 bg-background-lightGray  shadow-xs dark:bg-gray-800 border border-border-extraLight dark:border-gray-900">
          <h1 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
            Daily Sales
          </h1>
          <LineGraph />
        </div>
        <div className="flex-1 p-4 bg-background-lightGray  shadow-xs dark:bg-gray-800 border border-border-extraLight dark:border-gray-900">
          <h1 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
            Monthly Sales
          </h1>
          <BarGraph />
        </div>
      </div>
    </div>
  );
}

export default Home;
