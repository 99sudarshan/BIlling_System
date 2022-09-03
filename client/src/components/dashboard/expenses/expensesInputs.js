export const expensesInput = [
  {
    label: " Name",
    type: "text",
    name: "name",
    placeholder: "Expenses Name",
    validation: {
      required: {
        value: true,
        message: "Expenses Name is required.",
      },
    },
  },
  {
    label: "Amount",
    type: "text",
    name: "amount",
    placeholder: "Amount ",
    validation: {
      required: {
        value: true,
        message: "Amount is required.",
      },
      pattern: {
        value: /^[0-9]*$/,
        message: "Must be a number.",
      },
    },
  },
];
