import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { SearchIcon } from "../../../../assets/icons";
import {
  fetchProductBycategory,
  fetchProductBycategoryAndOrderId,
} from "../../../api/services/make-order/makeOrderApiService";

const CategoriesBar = () => {
  const { id } = useParams();
  const { categories, category_id } = useSelector(
    (state) => state.orderProduct
  );
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const handleFetchProduct = (cid) => {
    if (id) {
      dispatch(fetchProductBycategoryAndOrderId(cid, id));
    } else {
      dispatch(fetchProductBycategory(cid));
    }
  };

  useEffect(() => {
    categories.length > 0 &&
      !id &&
      dispatch(fetchProductBycategory(categories[0].id));
    //eslint-disable-next-line
  }, [categories]);

  return (
    <div className="w-60  h-full bg-background-lightGray dark:bg-gray-800 p-3">
      {/* search box  */}
      <div>
        <div className="relative  z-[0]">
          <input
            type="text"
            placeholder="Category"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <SearchIcon className="text-gray-400 absolute top-2 right-2 w-6 h-6 dark:text-gray-400" />
        </div>
      </div>
      {/* category list  */}
      <div className="h-full overflow-auto category pt-4 pb-10">
        <ul className="space-y-1">
          {categories
            .filter((data) => {
              if (!value) {
                return true;
              }
              if (data.name.toLowerCase().includes(value.toLowerCase())) {
                return true;
              } else {
                return false;
              }
            })
            .map((data, index) => (
              <li
                className={`${
                  category_id === data.id
                    ? "active-category-list "
                    : "category-list "
                }`}
                key={index}
                onClick={() => handleFetchProduct(data.id)}
              >
                {data.name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoriesBar;
