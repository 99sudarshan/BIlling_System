import React from "react";

export const SalesReturnPDF = React.forwardRef(({ report_list }, ref) => {
  return (
    <div ref={ref}>
      <div className="w-full overflow-hidden shadow mt-5">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap border">
            <thead>
              <tr className="text-xs font-semibold bg-gray-600 text-white tracking-wide text-left uppercase border-b dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">S.N.</th>
                <th className="px-4 py-3">Bill number</th>
                <th className="px-4 py-3">table</th>
                <th className="px-4 py-3">paid amount</th>
                <th className="px-4 py-3">Bill Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">paid status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {report_list.length > 0 ? (
                <>
                  {report_list.map((data, index) => {
                    const {
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
                        <td className="px-4 py-3 text-sm">{total_amount}</td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(ordered_date).toLocaleString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm">{customer_name}</td>
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
    </div>
  );
});
