import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { baseURL } from "../../../../api/axiosInstance";
import {
  addItemToOrderItem,
  editAddItemToOrderItem,
  editRemoveItemToOrderItem,
  removeItemToOrderItem,
} from "../../../../api/services/make-order/makeOrderApiService";

const ProductCard = ({ slug, image, name, quantity, price }) => {
  const { id } = useParams();
  const { category_id } = useSelector((state) => state.orderProduct);
  const dispatch = useDispatch();
  return (
    <div
      className={` bg-background-lightGray dark:bg-gray-800 flex items-center sm:block  p-3 gap-6 sm:gap-0`}
    >
      <div className="flex-1">
        <img
          src={`${baseURL}${image}`}
          alt=""
          className="w-28 h-28 object-cover sm:w-32  sm:h-32 sm:mx-auto rounded-full shadow-md"
        />
      </div>
      <div className="space-y-2">
        <h2 className=" text-center font-bold dark:text-gray-300">{name}</h2>
        <span className="flex justify-center text-center dark:text-gray-300">
          Rs.{price}
        </span>
        {/* inc dec quantity  */}
        <div className="flex justify-center">
          <div
            className={`flex rounded-l-md rounded-r-md overflow-hidden justify-center border border-border-dark dark:border-none text-text dark:text-gray-200`}
          >
            <button
              className={`w-10  dark:bg-gray-900 `}
              onClick={() => {
                if (id) {
                  dispatch(editRemoveItemToOrderItem(slug, id, category_id));
                } else {
                  dispatch(removeItemToOrderItem(slug, category_id));
                }
              }}
            >
              -
            </button>
            <input
              type="text"
              name=""
              id=""
              value={quantity}
              readOnly={true}
              className="py-2 mt-0 w-16 sm:w-20 border-l border-r border-y-0 text-center bg-background-lightGray border-border-dark"
            />
            <button
              className={`w-10  dark:bg-gray-900 `}
              onClick={() => {
                if (id) {
                  dispatch(editAddItemToOrderItem(slug, id, category_id));
                } else {
                  dispatch(addItemToOrderItem(slug, category_id));
                }
              }}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex justify-center rounded-lg text-sm">
          <span>
            <button
              className="flex items-center justify-between px-2 py-[0.5rem] text-sm font-medium leading-5 text-gray-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray addPayment"
              aria-label="Add"
            >
              Add Order Note
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
