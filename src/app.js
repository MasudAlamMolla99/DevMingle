const express = require("express");
const app = express();
const connectDb = require("./config/database");
const User = require("../src/models/user");
const validateSignupData = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    res.send(user);
  } catch (err) {
    res.status(400).send("Something error");
  }
});
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(401).send("Something error");
  }
});

app.delete("/user", (req, res) => {});

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const data = req.body;

    const ALLOWED_UPDATES = ["photoUrl", "age", "about", "gender", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      return res.status(400).send({ error: "Update not allowed" });
    }

    if (data?.skills && data.skills.length > 10) {
      return res.status(400).send({ error: "Skills cannot be more than 10" });
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

connectDb()
  .then(() => {
    console.log("Database connect");
    app.listen(3000, () => {
      console.log("Server Connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
