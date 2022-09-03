export const inputsFields = [
  {
    label: "Username",
    type: "text",
    name: "username",
    placeholder: "Username",
    validation: {
      required: {
        value: true,
        message: "Username is required.",
      },
    },
  },
  {
    label: "Password",
    type: "password",
    name: "password",
    placeholder: "Password",
    validation: {
      required: {
        value: true,
        message: "Password is required.",
      },
      minLength: {
        value: 8,
        message: "Password must be atleast 6 character.",
      },
      maxLength: {
        value: 14,
        message: "Password must not exceed 14 character.",
      },
    },
  },
];
