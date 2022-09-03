export const groupInputsFields = [
  {
    label: "Group Name",
    type: "text",
    name: "name",
    placeholder: "Group Name",
    validation: {
      required: {
        value: true,
        message: "Group Name is required.",
      },
    },
  },
  {
    label: "Group",
    name: "permissions",
    validation: {
      required: {
        value: true,
        message: "Select a group.",
      },
    },
    options: true,
  },
];
