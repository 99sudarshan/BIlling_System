import React from "react";

const Menu = () => {
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
  ];
  return (
    <div className="bg-patterns bg-repeat font-inter text-white h-screen overflow-auto pb-20">
      <div className="space-y-3 p-5">
        <div className="">
          <h1 className="mb-5 text-center font-anton text-3xl font-bold">
            Citylights Bistro
          </h1>
          <h1 className="mb-5 text-center font-anton text-2xl font-bold">
            Menu
          </h1>
        </div>
        {menus.map((data, index) => {
          return (
            <div
              className="border-border-extraLight rounded-md border py-10 px-5"
              key={index}
            >
              <div className="flex items-end gap-3 ">
                <h1 className="text-2xl font-bold">{data.category}</h1>
                <p className="mb-1.5 h-[0.1rem] bg-border-extraLight w-full "></p>
              </div>
              <div className="mt-5 space-y-3">
                {data.items.map((data, index) => {
                  return (
                    <div
                      className="flex justify-between text-lg border-b border-dotted"
                      key={index + 1}
                    >
                      <p>{data.name}</p>
                      <p className="font-semibold">Rs.{data.price}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Menu;
