const express = require("express");
const app = express();
const connectDb = require("./config/database");
const User = require("../src/models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  // console.log(req.body);
  // const newUser = new User();
  // try {
  //   await newUser.save();
  //   res.send("user created successfully");
  // } catch (err) {
  //   res.send("Error " + err.message);
  // }
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
