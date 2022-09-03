export const tableInputs = [
  {
    label: "Table Name",
    type: "text",
    name: "name",
    placeholder: "Group Name",
    validation: {
      required: {
        value: true,
        message: "Table Name is required.",
      },
    },
  },
  {
    label: "Capacity",
    type: "text",
    name: "capacity",
    placeholder: "Capacity ",
    validation: {
      required: {
        value: true,
        message: "Capacity is required.",
      },
      pattern: {
        value: /^[0-9]*$/,
        message: "Must be a number.",
      },
    },
  },
  {
    label: "Status",
    name: "status",
    validation: {
      required: {
        value: true,
        message: "Select a status.",
      },
    },
    options: [
      {
        name: "Free",
        value: 1,
      },
      {
        name: "Occupied",
        value: 0,
      },
    ],
  },
];
