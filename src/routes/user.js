const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName emailId age gender skills about";

userRouter.get("/user/review/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.send("ERROR:" + err.message);
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionReqs = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          { toUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);
    const data = connectionReqs.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.send("ERROR:" + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 50 ? 50 : limit;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const connectionReq = await connectionRequest
    .find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
    .select("fromUserId toUserId");

  const shouldHideFromUserFeed = new Set();
  connectionReq.forEach((req) => {
    shouldHideFromUserFeed.add(req.fromUserId);
    shouldHideFromUserFeed.add(req.toUserId);
  });

  const users = await User.find({
    _id: { $nin: Array.from(shouldHideFromUserFeed) },
  })
    .select(USER_SAFE_DATA)
    .skip(skip)
    .limit(limit);

  res.send({ data: users });
});

module.exports = userRouter;
