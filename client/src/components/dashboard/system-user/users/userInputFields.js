export const userInputsFields = [
  {
    label: "First Name",
    type: "text",
    name: "first_name",
    placeholder: "First Name",
    validation: {
      required: {
        value: true,
        message: "First Name is required.",
      },
    },
  },
  {
    label: "Last Name",
    type: "text",
    name: "last_name",
    placeholder: "Last Name",
    validation: {
      required: {
        value: true,
        message: "Last Name is required.",
      },
    },
  },
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
    label: "Email",
    type: "text",
    name: "email",
    placeholder: "Email@example.com",
    validation: {
      required: {
        value: true,
        message: "email is required.",
      },
      pattern: {
        value:
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi,
        message: "Invalid email address.",
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
  {
    label: "Confirm Password",
    type: "password",
    name: "cpassword",
    placeholder: "Confirm Password",
    cpass: true,
  },
  {
    label: "Group",
    name: "group",
    validation: {
      required: {
        value: true,
        message: "Select a group.",
      },
    },
    options: [
      {
        name: "Staff",
        value: "staff",
      },
      {
        name: "AA",
        value: "aa",
      },
    ],
  },
];
