import React from "react";
import { options } from "../../../common/dateOptions";

export const ProductWiseReportPDF = React.forwardRef(({ report_list }, ref) => {
  return (
    <div ref={ref}>
      <div className="w-full overflow-hidden shadow mt-5">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap border">
            <thead>
              <tr className="text-xs font-semibold bg-gray-600 text-white tracking-wide text-left uppercase border-b dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">S.N.</th>
                <th className="px-4 py-3">name</th>
                <th className="px-4 py-3">price</th>
                <th className="px-4 py-3">description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {report_list.length > 0 ? (
                <>
                  {report_list.map((data, index) => {
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
    </div>
  );
});
