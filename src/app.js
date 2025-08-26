const express = require("express");
const app = express();
const connectDb = require("./config/database");
const User = require("../src/models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  // console.log(req.body);
  const newUser = new User(req.body);
  try {
    await newUser.save();
    res.send("user created successfully");
  } catch (err) {
    res.send("Error " + err.message);
  }
});

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
