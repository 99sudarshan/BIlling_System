import React, { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { PrintIcon, SearchIcon, ViewIcon } from "../../../assets/icons";
import { fetchSalesReturnReport } from "../../api/services/system/systemUserApiService";
import CommonPopup from "../../common/CommonPopup";
import CSV from "../../common/CSV";
import { options } from "../../common/dateOptions";
import Excell from "../../common/Excell";
import MainHeader from "../../common/MainHeader";
import Pagination from "../../common/Pagination";
import ViewReportDetail from "../reports/audit-trail-report/ViewReportDetail";
import SalesReturnPdfConverter from "./SalesReturnPdfConverter";

const SalesReturnReport = () => {
  const [viewReport, setViewReport] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({});
  const [value, setValue] = useState("");
  const [reportDetail, setReportDetail] = useState({});
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
    fetchSalesReturnReport(setAllReports, setCompanyInfo);
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <CommonPopup
        open={viewReport}
        width="max-w-4xl"
        closeModal={() => setViewReport(false)}
      >
        <ViewReportDetail
          reportDetail={reportDetail}
          companyInfo={companyInfo}
        />
      </CommonPopup>
      <div>
        <MainHeader text="All Reports" />
        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-3 items-center">
            <CSV file={`sales-return`} data={allReports} />
            <Excell file={`sales-return`} data={allReports} />
            <SalesReturnPdfConverter report_list={allReports} />
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
              placeholder="Sales Report"
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
                  <th className="px-4 py-3">Bill number</th>
                  <th className="px-4 py-3">table</th>
                  <th className="px-4 py-3">paid amount</th>
                  <th className="px-4 py-3">Bill Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">paid status</th>
                  <th className="px-4 py-3">action</th>
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
                            .includes(value.toLowerCase()) ||
                          data.bill_no.toLowerCase().includes(value)
                        ) {
                          return true;
                        } else {
                          return false;
                        }
                      })
                      .map((data, index) => {
                        const {
                          id,
                          ordered_date,
                          total_amount,
                          bill_no,
                          table,
                          customer_name,
                          payment_method,
                        } = data;
                        return (
                          <tr
                            className="text-gray-700 dark:text-gray-400"
                            key={index}
                          >
                            <td className="px-4 py-3 text-sm">{index + 1}</td>
                            <td className="px-4 py-3 text-sm">{bill_no}</td>
                            <td className="px-4 py-3 text-sm">{table?.name}</td>
                            <td className="px-4 py-3 text-sm">
                              {total_amount}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {new Date(ordered_date).toLocaleTimeString(
                                undefined,
                                options
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {customer_name}
                            </td>
                            <td className="px-4 py-3 text-xs">
                              {payment_method === "credit" ? (
                                <span className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:bg-red-700 dark:text-green-100">
                                  {payment_method}
                                </span>
                              ) : (
                                <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                                  {payment_method}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs">
                              <div className="flex items-center gap-4 dark:text-gray-300">
                                <button
                                  className="action-button"
                                  onClick={() => {
                                    setReportDetail(data);
                                    setViewReport(true);
                                  }}
                                >
                                  <ViewIcon className="w-4 h-4" />
                                  <span>View</span>
                                </button>
                                <button
                                  className="action-button"
                                  onClick={() => {
                                    window.open(
                                      `/dashboard/print-report/${id}`,
                                      "_blank",
                                      "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=500,width=800,height=700"
                                    );
                                  }}
                                >
                                  <PrintIcon className="w-4 h-4" />
                                  <span>Print</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </>
                ) : (
                  <tr className="text-gray-700 dark:text-gray-400">
                    <td colSpan={8} className="px-4 py-3 text-sm ">
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
    </>
  );
};

export default SalesReturnReport;
