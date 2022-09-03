export const productInputs = [
  {
    label: "Product Image",
    type: "file",
    name: "image",
    placeholder: "Product Image",
    validation: {
        required: {
          value: true,
          message: "Product image is required.",
        },
      validate: {
        lessThan10MB: (files) => files[0]?.size < 10000000 || "Max 10MB",
        acceptedFormats: (files) =>
          ["image/jpeg", "image/png", "image/gif"].includes(files[0]?.type) ||
          "Only PNG, JPEG e GIF",
      },
    },
  },
  {
    label: "Product Name",
    type: "text",
    name: "name",
    placeholder: "Product Name",
    validation: {
      required: {
        value: true,
        message: "Product Name is required.",
      },
    },
  },
  {
    label: "Price",
    type: "text",
    name: "price",
    placeholder: "Product Price ",
    validation: {
      required: {
        value: true,
        message: "Price is required.",
      },
      pattern: {
        value: /^[0-9]*$/,
        message: "Must be a number.",
      },
    },
  },
  {
    label: "Description",
    type: "textarea",
    name: "description",
    placeholder: "Product Description ",
    validation: {
      required: {
        value: true,
        message: "Description is required.",
      },
    },
  },
  {
    label: "Category",
    name: "category_id",
    validation: {
      required: {
        value: true,
        message: "Select a category.",
      },
    },
    options: "category",
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
    options: "status",
  },
];
