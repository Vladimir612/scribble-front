export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validation = ({ min, email, exact, value }) => {
  let validation = true;
  let message = "";
  if (!value) return { v: false, msg: "Field is required!" };

  if (email) {
    if (!validateEmail(value)) {
      validation = false;
      message = "Email is not valid!";
    }
  }
  if (exact) {
    if (exact !== value) {
      validation = false;
      message = "Passwords doesn't match!";
    }
  }

  if (min) {
    if (value.length < min) {
      validation = false;
      message = "Field must be " + min + " characters long!";
    }
  }

  return { v: validation, msg: message };
};
