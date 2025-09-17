const express = require("express");

const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validatePasswordStrength,
} = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(401).send("ERROR:" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    console.log(loggedInUser);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    console.log(loggedInUser);
    await loggedInUser.save();
    res.status(200).json({
      message: "Profile updated successfully",
      data: loggedInUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
profileRouter.patch("/profile/forget-password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const newPassword = req.body.password;
    validatePasswordStrength(req);
    const hashPassword = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = hashPassword;
    await loggedInUser.save();
    res.send("Password updated Successfully");
  } catch (err) {
    res.send("ERROR:" + err.message);
  }
});

module.exports = profileRouter;
