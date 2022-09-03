import React, { useEffect, useState } from "react";
import { CrossIcon } from "../../../assets/icons";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import LoadingRing from "../../common/LoadingRing";
import {
  addProduct,
  updateProductData,
} from "../../api/services/product/productApiServices";
import { productInputs } from "./productInputs";
import { fileHandler } from "../../common/fileHandler";

const AddProduct = ({ productData, closeModal }) => {
  const [productImage, setProductImage] = useState({
    name: "",
    file: "",
  });
  const [productImageErr, setProductImageErr] = useState("");
  const [dOptions, setDOptions] = useState({
    category: [],
    status: [
      {
        name: "Active",
        value: 1,
      },
      {
        name: "Inactive",
        value: 0,
      },
    ],
  });
  const { category_list } = useSelector((state) => state.product);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (productImage.name === "") {
      setProductImageErr("select the product image");
    } else {
      setProductImageErr("");
      setLoading(true);
      const formData = new FormData();
      formData.append("category_id", parseInt(data.category_id));
      formData.append("description", data.description);
      formData.append("name", data.name);
      formData.append("price", parseInt(data.price));
      formData.append("status", parseInt(data.status));
      formData.append("image", productImage.file ? productImage.file : "");

      if (productData.id === "") {
        dispatch(addProduct(formData, setLoading, closeModal));
      } else {
        dispatch(
          updateProductData(productData.id, formData, setLoading, closeModal)
        );
      }
    }
  };

  useEffect(() => {
    if (productData.id !== "") {
      reset(productData);
      setProductImage({
        ...productImage,
        name: productData.image,
      });
    }
    if (category_list.length > 0) {
      const newCat = category_list.map((data) => {
        return {
          name: data.name,
          value: data.id,
        };
      });
      setDOptions({
        ...dOptions,
        category: newCat,
      });
    }
    //eslint-disable-next-line
  }, [productData, category_list]);
  return (
    <div>
      <div className="px-6 py-4 mb-8  h-fulldark:bg-gray-800">
        <header className="flex justify-end">
          <button
            className="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover: hover:text-gray-700"
            onClick={closeModal}
          >
            <CrossIcon className="w-4 h-4" />
          </button>
        </header>
        <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Add Table
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {productInputs.map((data, index) => {
            const { label, name, type, validation, placeholder, options } =
              data;
            return (
              <div key={index}>
                {options ? (
                  <div>
                    <label>{label}</label>
                    <select
                      defaultValue={productData.id ? productData.status : 1}
                      {...register(name, validation)}
                    >
                      {dOptions[options].map((data, index) => {
                        return (
                          <option value={data.value} key={index + 1}>
                            {data.name}
                          </option>
                        );
                      })}
                    </select>

                    <p className="error"> {errors?.[name]?.message}</p>
                  </div>
                ) : (
                  <>
                    {type === "textarea" ? (
                      <div>
                        <label>{label}</label>
                        <textarea
                          placeholder={placeholder}
                          {...register(name, validation)}
                        />
                        <p className="error"> {errors?.[name]?.message}</p>
                      </div>
                    ) : (
                      <>
                        {type === "file" ? (
                          <div>
                            <label>{label}</label>
                            <input
                              id="product"
                              className="hidden"
                              type="file"
                              placeholder={placeholder}
                              onChange={(e) => {
                                fileHandler(
                                  e.target.files[0],
                                  productImage,
                                  setProductImage,
                                  setProductImageErr
                                );
                              }}
                            />
                            <label
                              htmlFor="product"
                              className=" w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none  dark:text-gray-300 bg-white rounded border border-border-extraLight cursor-pointer flex items-center gap-4"
                            >
                              <div className="py-2 bg-background-midGray w-32 text-center text-white">
                                Select Image
                              </div>
                              <span>
                                {productImage.name === ""
                                  ? "no image choosen"
                                  : productImage.name}
                              </span>
                            </label>
                            <p className="error"> {productImageErr}</p>
                          </div>
                        ) : (
                          <div>
                            <label>{label}</label>
                            <input
                              type={type}
                              placeholder={placeholder}
                              {...register(name, validation)}
                            />
                            <p className="error"> {errors?.[name]?.message}</p>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            );
          })}
          <button className="button-style" disabled={loading}>
            {loading ? (
              <LoadingRing />
            ) : (
              <>{productData.id === "" ? "Add Product" : "Update Product"}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
