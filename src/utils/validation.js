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

module.exports = validateSignupData;
