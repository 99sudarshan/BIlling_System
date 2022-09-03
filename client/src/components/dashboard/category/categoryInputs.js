export const categoryInputs = [
  {
    label: "Name",
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
        name: "Active",
        value: 1,
      },
      {
        name: "Inactive",
        value: 0,
      },
    ],
  },
];
