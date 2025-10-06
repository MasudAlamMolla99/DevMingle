const express = require("express");
const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      photoUrl,
      about,
      skills,
    } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      age,
      gender,
      photoUrl,
      about,
      skills,
    });
    const savedUser = await newUser.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
    });

    res.json({ message: "user created successfully", data: savedUser });
  } catch (err) {
    res.send("Error " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
      });

      res.send(user);
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successfully");
});

module.exports = authRouter;
