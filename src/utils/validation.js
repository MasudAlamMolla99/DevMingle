const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  }

  // Password

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number"
    );
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "photoUrl",
    "gender",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

const validatePasswordStrength = (req) => {
  const password = req.body.password;

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number"
    );
  } else {
    return true;
  }
};

module.exports = {
  validateSignupData,
  validateEditProfileData,
  validatePasswordStrength,
};
