const EMAIL_VALIDITY = "Invalid email address";

const errorHandler = (property, value) => {
  if (property === "email") {
    if (
      !value.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi
      )
    ) {
      return EMAIL_VALIDITY;
    } else {
      return "";
    }
  } else {
    return "";
  }
};

export const passwordErrorHandler = (password, confirm_password) => {
  if (password !== confirm_password) {
    return CONFIRM_PASSWORD_VALIDITY;
  } else {
    return "";
  }
};

export default errorHandler;
