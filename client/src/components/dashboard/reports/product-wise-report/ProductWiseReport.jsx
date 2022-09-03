import React, { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { SearchIcon } from "../../../../assets/icons";
import { fetchProductWiseReport } from "../../../api/services/system/systemUserApiService";
import CSV from "../../../common/CSV";
import { options } from "../../../common/dateOptions";
import Excell from "../../../common/Excell";
import MainHeader from "../../../common/MainHeader";
import Pagination from "../../../common/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductData } from "../../../api/services/product/productApiServices";
import ProductWiseReportPdfConverter from "./ProductWiseReportPdfConverter";

const ProductWiseReport = () => {
  const dispatch = useDispatch();
  const { product_list } = useSelector((state) => state.product);
  const [productSlug, setProductSlug] = useState("");
  const [type, setType] = useState("daily");
  const [value, setValue] = useState("");
  const [allReports, setAllReports] = useState([]);
  const [listsPerPage, setListPerPage] = useState(5);
  const [page, setPage] = useState(4);
  const [currentButton, setCurrentButton] = useState(1);
  const paginatedData = useMemo(() => {
    let computedData = allReports;
    setPage(Math.ceil(computedData.length / parseInt(listsPerPage)));
    return computedData;
    // eslint-disable-next-line
  }, [allReports]);

  //Get current lists
  const indexOfLastPost = currentButton * parseInt(listsPerPage);
  const indexOfFirstPost = indexOfLastPost - parseInt(listsPerPage);
  const currentActivityLists = paginatedData.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  useEffect(() => {
    product_list.length > 0 &&
      fetchProductWiseReport(
        productSlug ? productSlug : product_list[0].slug,
        type,
        setAllReports
      );
    //eslint-disable-next-line
  }, [type, productSlug, product_list]);

  useEffect(() => {
    dispatch(fetchProductData());
    //eslint-disable-next-line
  }, []);

  return (
    <div>
      <MainHeader text="Product Wise Reports" />
      <div className="flex gap-1 items-center">
        <select
          value={productSlug}
          className="w-60"
          onChange={(e) => setProductSlug(e.target.value)}
        >
          {product_list.map((data, index) => {
            return (
              <option value={data.slug} key={index}>
                {data.name}
              </option>
            );
          })}
        </select>
        <select
          value={type}
          className="w-32"
          onChange={(e) => setType(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-3 items-center">
          <CSV
            file={productSlug ? productSlug : product_list[0]?.slug}
            data={allReports}
          />
          <Excell
            file={productSlug ? productSlug : product_list[0]?.slug}
            data={allReports}
          />
          <ProductWiseReportPdfConverter report_list={allReports} />
          <div className="flex gap-1 items-center text-xs dark:text-gray-200">
            <span>Show</span>
            <select
              value={listsPerPage}
              onChange={(e) => setListPerPage(e.target.value)}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>Entries</span>
          </div>
        </div>
        <div className="relative z-[0]">
          <input
            type="text"
            placeholder="Report"
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
                <th className="px-4 py-3">S.N.</th>
                <th className="px-4 py-3">name</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {allReports.length > 0 ? (
                <>
                  {currentActivityLists
                    .filter((data) => {
                      if (!value) {
                        return true;
                      }
                      if (
                        new Date(data.ordered_date)
                          .toLocaleTimeString(undefined, options)
                          .toLowerCase()
                          .includes(value.toLowerCase())
                      ) {
                        return true;
                      } else {
                        return false;
                      }
                    })
                    .map((data, index) => {
                      const { ordered_date, total_price, product } = data;
                      return (
                        <tr
                          className="text-gray-700 dark:text-gray-400"
                          key={index}
                        >
                          <td className="px-4 py-3 text-sm">{index + 1}</td>
                          <td className="px-4 py-3 text-sm">{product}</td>
                          <td className="px-4 py-3 text-sm">
                            {" "}
                            {new Date(ordered_date).toLocaleTimeString(
                              undefined,
                              options
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs">{total_price}</td>
                        </tr>
                      );
                    })}
                </>
              ) : (
                <tr className="text-gray-700 dark:text-gray-400">
                  <td colSpan={3} className="px-4 py-3 text-sm ">
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
      {allReports.length > listsPerPage && (
        <div className="flex justify-end mt-5">
          <Pagination
            setCurrentButton={setCurrentButton}
            currentButton={currentButton}
            page={page}
          />
        </div>
      )}
    </div>
  );
};

export default ProductWiseReport;
