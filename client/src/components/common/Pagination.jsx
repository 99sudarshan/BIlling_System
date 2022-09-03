import React, { useState, useEffect, useMemo } from "react";
const Pagination = ({ page, setCurrentButton, currentButton }) => {
  const noOfPages = page;
  const [currentPage, setCurrentPage] = useState(1);

  //const [numberOfPages, setNumberOfPages] = useState([]);
  //Set number of pages
  // Current active button number

  const numberOfPages = useMemo(() => {
    let numOfPages = [];
    for (let i = 1; i <= noOfPages; i++) {
      numOfPages.push(i);
    }
    return numOfPages;
    // eslint-disable-next-line
  }, []);

  // Array of buttons what we see on the page
  const [arrOfCurrButtons, setArrOfCurrButtons] = useState([]);

  useEffect(() => {
    //Temp no of Pages
    let tempNumberOfPages = [...arrOfCurrButtons];

    //Set dots
    let dotsInitial = "...";
    let dotsLeft = "... ";
    let dotsRight = " ...";

    if (numberOfPages.length < 6) {
      //num of pages < 6
      tempNumberOfPages = numberOfPages;
    } else if (currentButton >= 1 && currentButton <= 3) {
      //current button 1 to 3
      tempNumberOfPages = [1, 2, 3, 4, dotsInitial, numberOfPages.length];
    } else if (currentButton === 4) {
      //current button 4
      const sliced = numberOfPages.slice(0, 5);
      tempNumberOfPages = [...sliced, dotsInitial, numberOfPages.length];
    } else if (currentButton > 4 && currentButton < numberOfPages.length - 2) {
      // from 5 to 8 -> (10 - 2)
      const sliced1 = numberOfPages.slice(currentButton - 2, currentButton); // sliced1 (5-2, 5) -> [4,5]
      const sliced2 = numberOfPages.slice(currentButton, currentButton + 2); // sliced2 (5, 5+2) -> [6,7]
      tempNumberOfPages = [
        1,
        dotsLeft,
        ...sliced1,
        ...sliced2,
        dotsRight,
        numberOfPages.length,
      ]; // [1, '...', 4, 5, 6, 7,'...', 10]
    } else if (currentButton > numberOfPages.length - 3) {
      // > 7
      const sliced = numberOfPages.slice(numberOfPages.length - 4); // slice last 4 [7, 8, 9, 10]
      tempNumberOfPages = [1, dotsLeft, ...sliced];
    } else if (currentButton === dotsInitial) {
      // [1, 2, 3, 4, "...", 10].length = 6 - 3  = 3
      // arrOfCurrButtons[3] = 4 + 1 = 5
      // or
      // [1, 2, 3, 4, 5, "...", 10].length = 7 - 3 = 4
      // [1, 2, 3, 4, 5, "...", 10][4] = 5 + 1 = 6
      setCurrentButton(arrOfCurrButtons[arrOfCurrButtons.length - 3] + 1);
    } else if (currentButton === dotsRight) {
      // [1, "...", 5, 6, 7, 8, "...", 10].length = 6 - 3  = 3
      // arrOfCurrButtons[3] = 6 + 2 = 8
      setCurrentButton(arrOfCurrButtons[3] + 2);
    } else if (currentButton === dotsLeft) {
      // [1, "...", 5, 6, 7, 8, "...", 10].length = 6 - 3  = 3
      // arrOfCurrButtons[3] = 6 - 2 = 4
      setCurrentButton(arrOfCurrButtons[3] - 2);
    } else if (numberOfPages.length < currentButton) {
      setCurrentButton(1);
    }

    setArrOfCurrButtons(tempNumberOfPages);
    setCurrentPage(currentButton);
    // eslint-disable-next-line
  }, [currentButton, numberOfPages, currentPage, numberOfPages.length]);

  return (
    <>
      <div className="flex items-center gap-4 px-10">
        {/* next and previoius n */}
        {/* Previous Button */}
        <button
          className={`w-8 h-8 grid place-content-center bg-gray-100 text-charlieGray dark:bg-gray-800 dark:text-gray-200 `}
          onClick={() =>
            setCurrentButton((prev) => (prev <= 1 ? prev : prev - 1))
          }
        >
          <span>
            <svg
              width="7"
              height="13"
              viewBox="0 0 7 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.36078 11.875C5.52484 12.0322 5.72309 12.1211 5.95551 12.1211C6.42719 12.1211 6.80316 11.7451 6.80316 11.2803C6.80316 11.041 6.70746 10.8291 6.53656 10.665L2.08637 6.32422L6.53656 1.99707C6.70746 1.82617 6.80316 1.61426 6.80316 1.38184C6.80316 0.916993 6.42719 0.541016 5.95551 0.541016C5.71625 0.541016 5.52484 0.623047 5.36078 0.780274L0.377382 5.6543C0.172304 5.85254 0.0766011 6.07129 0.0697651 6.33105C0.0697651 6.58398 0.165468 6.7959 0.370546 7.00098L5.36078 11.875Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </button>
        {/* Array of Current Buttons */}
        <div className="flex items-center gap-2">
          {arrOfCurrButtons.map((item, index) => {
            return (
              <div
                key={index}
                className={`w-8 h-8 grid place-content-center text-sm  cursor-pointer + ${
                  currentButton === item
                    ? "bg-background-midGray dark:bg-black text-white font-semibold"
                    : "bg-gray-100 text-charlieGray dark:bg-gray-800 dark:text-gray-200"
                }`}
                onClick={() => setCurrentButton(item)}
              >
                {item}
              </div>
            );
          })}
        </div>
        {/* Next Button */}
        <button
          className={`w-8 h-8 grid place-content-center bg-gray-100 text-charlieGray dark:bg-gray-800 dark:text-gray-200`}
          onClick={() =>
            setCurrentButton((prev) =>
              prev >= numberOfPages.length ? prev : prev + 1
            )
          }
        >
          <span>
            <svg
              width="7"
              height="13"
              viewBox="0 0 7 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.63922 1.125C1.47516 0.967773 1.27691 0.878906 1.04449 0.878906C0.572813 0.878906 0.196836 1.25488 0.196836 1.71973C0.196836 1.95898 0.292539 2.1709 0.463438 2.33496L4.91363 6.67578L0.463438 11.0029C0.292539 11.1738 0.196836 11.3857 0.196836 11.6182C0.196836 12.083 0.572813 12.459 1.04449 12.459C1.28375 12.459 1.47516 12.377 1.63922 12.2197L6.62262 7.3457C6.8277 7.14746 6.9234 6.92871 6.93023 6.66895C6.93023 6.41602 6.83453 6.2041 6.62945 5.99902L1.63922 1.125Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </button>
      </div>
    </>
  );
};

export default Pagination;
