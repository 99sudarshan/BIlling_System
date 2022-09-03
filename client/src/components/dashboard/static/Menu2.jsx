import React from "react";
import logo from "../../../assets/img/cityLogo.png";
const Menu2 = () => {
  const menus = [
    {
      category: "Breakfast",
      items: [
        {
          name: "Omlet",
          price: 40,
        },
        {
          name: "Cappucino",
          price: 140,
        },
        {
          name: "Americano",
          price: 240,
        },
        {
          name: "Mixed Fruits",
          price: 340,
        },
      ],
    },
    {
      category: "Chicken",
      items: [
        {
          name: "Chicken Chilly",
          price: 350,
        },
        {
          name: "Chicken Lollipop",
          price: 560,
        },
      ],
    },
    {
      category: "Breakfast",
      items: [
        {
          name: "Omlet",
          price: 40,
        },
        {
          name: "Cappucino",
          price: 140,
        },
        {
          name: "Americano",
          price: 240,
        },
        {
          name: "Mixed Fruits",
          price: 340,
        },
      ],
    },
    {
      category: "Chicken",
      items: [
        {
          name: "Chicken Chilly",
          price: 350,
        },
        {
          name: "Chicken Lollipop",
          price: 560,
        },
      ],
    },
    {
      category: "Breakfast",
      items: [
        {
          name: "Omlet",
          price: 40,
        },
        {
          name: "Cappucino",
          price: 140,
        },
        {
          name: "Americano",
          price: 240,
        },
        {
          name: "Mixed Fruits",
          price: 340,
        },
      ],
    },
    {
      category: "Chicken",
      items: [
        {
          name: "Chicken Chilly",
          price: 350,
        },
        {
          name: "Chicken Lollipop",
          price: 560,
        },
      ],
    },
    {
      category: "Breakfast",
      items: [
        {
          name: "Omlet",
          price: 40,
        },
        {
          name: "Cappucino",
          price: 140,
        },
        {
          name: "Americano",
          price: 240,
        },
        {
          name: "Mixed Fruits",
          price: 340,
        },
      ],
    },
    {
      category: "Chicken",
      items: [
        {
          name: "Chicken Chilly",
          price: 350,
        },
        {
          name: "Chicken Lollipop",
          price: 560,
        },
      ],
    },
    {
      category: "Breakfast",
      items: [
        {
          name: "Omlet",
          price: 40,
        },
        {
          name: "Cappucino",
          price: 140,
        },
        {
          name: "Americano",
          price: 240,
        },
        {
          name: "Mixed Fruits",
          price: 340,
        },
      ],
    },
    {
      category: "Chicken",
      items: [
        {
          name: "Chicken Chilly",
          price: 350,
        },
        {
          name: "Chicken Lollipop",
          price: 560,
        },
      ],
    },
    {
      category: "Breakfast",
      items: [
        {
          name: "Omlet",
          price: 40,
        },
        {
          name: "Cappucino",
          price: 140,
        },
        {
          name: "Americano",
          price: 240,
        },
        {
          name: "Mixed Fruits",
          price: 340,
        },
      ],
    },
    {
      category: "Chicken",
      items: [
        {
          name: "Chicken Chilly",
          price: 350,
        },
        {
          name: "Chicken Lollipop",
          price: 560,
        },
      ],
    },
  ];
  return (
    <div className=" h-screen overflow-auto ">
      <div className="">
        <img src={logo} alt="" className="w-60 mx-auto" />
      </div>
      {/* header  */}
      <h1 className="bg-[#e4e8ec] text-[#3e2b18] font-cursive text-center text-4xl py-3 mt-3 ">
        Digital Menu
      </h1>
      <div className="bg-patterns bg-repeat font-inter pb-20 text-gray-100 pt-10 space-y-9">
        {/* category  */}
        {menus.map((data, index) => {
          return (
            <div key={index} className="px-5">
              {index > 0 && index % 5 === 0 && (
                <div className="mb-10">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-danger mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </span>
                  <p className="text-center text-red-500 text-sm">
                    Please let us know if you have any alergy, special dietry
                    need or restriction we will happily enhance your dining
                    experience.
                  </p>
                  <p className="text-center text-sm">
                    (All above price is fixed. And price in Nepali rupees)
                  </p>
                </div>
              )}
              <div>
                <h1 className="text-center font-cursive text-3xl">
                  {data.category} Menu
                </h1>
                <div className="mt-5 space-y-3">
                  {data.items.map((data, index) => {
                    return (
                      <div
                        className="flex justify-between text-lg"
                        key={index + 1}
                      >
                        <p>{data.name}</p>
                        <p className="font-semibold">Rs.{data.price}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Menu2;
