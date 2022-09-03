import React, { useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DefaultProductIcon,
  EditIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "../../../assets/icons";
import { baseURL } from "../../api/axiosInstance";
import {
  deleteProductData,
  fetchCategoryData,
  fetchProductData,
  fetchProductDataById,
} from "../../api/services/product/productApiServices";

import CommonPopup from "../../common/CommonPopup";
import CSV from "../../common/CSV";
import DeleteCard from "../../common/DeleteCard";
import Excell from "../../common/Excell";
import MainHeader from "../../common/MainHeader";
import Pagination from "../../common/Pagination";
import AddProduct from "./AddProduct";
import ProductPdfConverter from "./ProductPdfConverter";

const ProductTable = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [productData, setProductData] = useState({
    id: "",
    category_id: "",
    image: "",
    name: "",
    description: "",
    price: "",
    status: "",
  });

  const { product_list, category_list } = useSelector((state) => state.product);
  const listsPerPage = 4;
  const [page, setPage] = useState(4);
  const [currentButton, setCurrentButton] = useState(1);

  const dispatch = useDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    name: "",
    id: "",
  });

  const paginatedData = useMemo(() => {
    let computedData = product_list;
    setPage(Math.ceil(computedData.length / listsPerPage));
    return computedData;
    // eslint-disable-next-line
  }, [product_list]);

  //Get current lists
  const indexOfLastPost = currentButton * listsPerPage;
  const indexOfFirstPost = indexOfLastPost - listsPerPage;
  const currentActivityLists = paginatedData.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  const handleDelete = () => {
    setIsDeleting(true);
    dispatch(
      deleteProductData(selectedItem.id, setIsDeleting, setOpenDeleteModal)
    );
  };

  const fetchProductDataByID = (id) => {
    fetchProductDataById(id, productData, setProductData);
    setOpen(true);
  };

  useEffect(() => {
    category_list.length === 0 && dispatch(fetchCategoryData());
    dispatch(fetchProductData());
    //eslint-disable-next-line
  }, [category_list]);

  return (
    <>
      <CommonPopup
        open={openDeleteModal}
        closeModal={() => setOpenDeleteModal(false)}
        width="w-64"
      >
        <DeleteCard
          name={selectedItem.name}
          loading={isDeleting}
          closeModal={() => setOpenDeleteModal(false)}
          deleteData={handleDelete}
        />
      </CommonPopup>
      <CommonPopup
        open={open}
        closeModal={() => {
          setOpen(false);
          setProductData({
            ...productData,
            id: "",
            category_id: "",
            image: "",
            name: "",
            description: "",
            price: "",
            status: "",
          });
        }}
        width="max-w-xl"
      >
        <AddProduct
          closeModal={() => {
            setOpen(false);
            setProductData({
              ...productData,
              id: "",
              category_id: "",
              image: "",
              name: "",
              description: "",
              price: "",
              status: "",
            });
          }}
          productData={productData}
        />
      </CommonPopup>
      <div>
        <MainHeader text="Products" />
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <CSV
              file="products"
              data={product_list.map((data) => {
                return {
                  name: data.name,
                  price: data.price,
                  description: data.description,
                  category: data.category.name,
                };
              })}
            />
            <Excell
              file="products"
              data={product_list.map((data) => {
                return {
                  name: data.name,
                  price: data.price,
                  description: data.description,
                  category: data.category.name,
                };
              })}
            />
            <ProductPdfConverter />
          </div>
          <div className="relative z-[0]">
            <input
              type="text"
              placeholder="Product"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <SearchIcon className="text-gray-400 absolute top-3 right-2 w-6 h-6 dark:text-gray-400" />
          </div>
        </div>

        {/* <!-- Table --> */}
        <div className="w-full overflow-hidden shadow mt-2">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold bg-gray-600 text-white tracking-wide text-left uppercase border-b dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3">image</th>
                  <th className="px-4 py-3">name</th>
                  <th className="px-4 py-3">price</th>
                  <th className="px-4 py-3">description</th>
                  <th className="px-4 py-3">status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {product_list.length > 0 ? (
                  <>
                    {currentActivityLists
                      .filter((data) => {
                        if (!value) {
                          return true;
                        }
                        if (
                          data.name.toLowerCase().includes(value.toLowerCase())
                        ) {
                          return true;
                        } else {
                          return false;
                        }
                      })
                      .map((data, index) => {
                        const { id, image, name, price, description, status } =
                          data;
                        return (
                          <tr
                            className="text-gray-700 dark:text-gray-400"
                            key={index}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center text-sm">
                                {/* <!-- Avatar with inset shadow --> */}
                                {image === null ? (
                                  <DefaultProductIcon className="w-8 h-8 dark:text-gray-300" />
                                ) : (
                                  <div className="relative hidden w-8 h-8 mr-3  md:block z-0">
                                    <img
                                      className="object-cover w-full h-full rounded-full"
                                      src={`${baseURL}${image}`}
                                      alt=""
                                    />
                                    <div className="absolute inset-0  shadow-inner"></div>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">{name}</td>
                            <td className="px-4 py-3 text-sm">{price}</td>
                            <td className="px-4 py-3 text-xs">{description}</td>
                            <td className="px-4 py-3 text-sm">
                              {status === 1 ? (
                                <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                                  Active
                                </span>
                              ) : (
                                <span className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:bg-red-700 dark:text-green-100">
                                  Inactive
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center gap-4">
                                  <button
                                    className="flex items-center gap-1 bg-background-lightGray text-sm rounded px-1 py-1 hover:text-blue-500 
                            font-semibold hover:bg-blue-100 animation dark:bg-gray-900 dark:text-gray-400 dark:hover:text-blue-500 dark:hover:bg-blue-100"
                                    onClick={() => {
                                      fetchProductDataByID(id);
                                    }}
                                  >
                                    <EditIcon className="w-5 h-5" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    className="flex items-center gap-1 bg-background-lightGray text-sm rounded px-1 py-1 hover:text-red-500 
                            font-semibold hover:bg-red-100 animation dark:bg-gray-900 dark:text-gray-400 
                            dark:hover:text-red-500 dark:hover:bg-red-100"
                                    onClick={() => {
                                      setSelectedItem({
                                        name: name,
                                        id,
                                      });
                                      setOpenDeleteModal(true);
                                    }}
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </>
                ) : (
                  <tr className="text-gray-700 dark:text-gray-400">
                    <td colSpan={6} className="px-4 py-3 text-sm ">
                      <div className="flex justify-center items-center w-full">
                        no data to show
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {product_list.length > listsPerPage && (
          <div className="flex justify-end mt-5">
            <Pagination
              setCurrentButton={setCurrentButton}
              currentButton={currentButton}
              page={page}
            />
          </div>
        )}
      </div>
      <div className="absolute bottom-6 right-6" onClick={() => setOpen(!open)}>
        <button className="flex items-center justify-between px-3 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-gray-600 border border-transparent rounded-full active:bg-gray-600 hover:bg-gray-700 focus:outline-none focus:shadow-outline-gray">
          <PlusIcon className="w-8 h-8" />
        </button>
      </div>
    </>
  );
};

export default ProductTable;
