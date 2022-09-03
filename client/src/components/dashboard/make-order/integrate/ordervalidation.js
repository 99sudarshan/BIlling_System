export const ordervalidation = (property, data) => {
  if (property === "customer_pan") {
    if (data.length > 0) {
      if (data.length !== 9) {
        return "Invalid pan number";
      } else {
        return "";
      }
    } else {
      return "";
    }
  }
  if (property === "table") {
    if (data === "") {
      return `${property} is required`;
    } else {
      return "";
    }
  }
};
