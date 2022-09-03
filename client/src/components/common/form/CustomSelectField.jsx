import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import usdt from "../../assets/images/usdt.png";
import usdc from "../../assets/images/usdc.png";
import sol from "../../assets/images/sol.png";

const CustomSelectField = ({
  dropdown,
  value,
  handleChange,
  placeholder,
  name,
  message,
}) => {
  return (
    <div className={` font-inter`}>
      <Listbox value={value} onChange={handleChange}>
        <div className="relative">
          <Listbox.Button className="relative px-5  py-2.5 2xl:py-3.5 w-full rounded-lg 2xl:rounded-xl  border-transparent placeholder-gray-500 focus:outline-none focus:border-border-dark focus:bg-transparent focus:ring-0 border border-border-light mt-2 text-left bg-white flex space-x-1 items-center">
            {name === "SOL" && <img src={sol} className="w-6" alt="" />}
            {name === "USDC" && <img src={usdc} className="w-6" alt="" />}
            {name === "USDT" && <img src={usdt} className="w-6" alt="" />}

            {name ? (
              <span className="text-left text-head ">{name}</span>
            ) : (
              <span className="text-left text-gray-500 ">{placeholder}</span>
            )}

            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              {/* icon  */}
              <span>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute w-full py-2 mt-1 overflow-auto text-base bg-white rounded-xl max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm px-2 border border-border z-10">
              {dropdown.length === 0 ? (
                <div className="cursor-pointer select-none relative py-2 px-4 rounded-xl  text-text-tertiary text-sm text-center">
                  {message}
                </div>
              ) : (
                <>
                  {dropdown.map((data, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        `${
                          active ? "bg-inputgray" : "text-text"
                        } cursor-pointer select-none relative py-2 px-4 rounded-xl text-lg`
                      }
                      value={data.value}
                    >
                      {({ value, active }) => (
                        <>
                          <span
                            className={`${
                              value ? "font-medium" : "font-normal"
                            } block truncate`}
                          >
                            {data.name}
                            <span>
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                strokeWidth="2"
                                className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                                  active ? "opacity-100" : "opacity-0"
                                }`}
                              >
                                <path
                                  d="M5 12L10 17L20 7"
                                  stroke="currentColor"
                                  strokeWidth="currentStroke"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>
                              </svg>
                            </span>
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </>
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default CustomSelectField;
