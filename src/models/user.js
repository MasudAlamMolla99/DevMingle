const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      minLength: 8,
      maxLength: 12,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 50,
    },
    gender: {
      type: String,
      required: true,

      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
    },
    about: {
      type: String,
      default: "Add about yourself",
      validate(value) {
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          throw new Error("About section must not contain special characters");
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
