import React from "react";

export const ProductsPdf = React.forwardRef(({ product_list }, ref) => {
  return (
    <div ref={ref}>
      <div className="w-full overflow-hidden shadow mt-5">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap border">
            <thead>
              <tr className="text-xs font-semibold bg-gray-600 text-white tracking-wide text-left uppercase border-b dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">name</th>
                <th className="px-4 py-3">price</th>
                <th className="px-4 py-3">description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {product_list.length > 0 ? (
                <>
                  {product_list.map((data, index) => {
                    const { name, price, description } = data;
                    return (
                      <tr
                        className="text-gray-700 dark:text-gray-400"
                        key={index}
                      >
                        <td className="px-4 py-3 text-sm">{name}</td>
                        <td className="px-4 py-3 text-sm">{price}</td>
                        <td className="px-4 py-3 text-xs">{description}</td>
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
