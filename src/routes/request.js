const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const connectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type" + status,
        });
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User not found" });
      }

      const existingConnectionRequest = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).send("Connection request already exist");
      }

      const connectionReq = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionReq.save();
      res.json({ message: req.firstName + "is" + status, data });
    } catch (err) {
      res.send("ERROR:" + err.message);
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const allowedStatus = ["accepted", "rejected"];
      const { status, requestId } = req.body;
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }

      const connectionRequest = await connectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        res.status(400).json({ message: "No connection found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "Connection request" + status, data });
    } catch (err) {
      res.send("ERROR:" + err.message);
    }
  }
);

module.exports = requestRouter;
