const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
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
      let message = "";
      if (status === "interested") {
        message = `${req.user.firstName} is interested in your profile`;
      } else if (status === "ignored") {
        message = `${req.user.firstName} has ignored your profile`;
      }
      return res.json({
        message,
        status,
      });
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
      const { status, requestId } = req.params;
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }

      const connectionRequests = await connectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequests) {
        res.status(400).json({ message: "No connection found" });
      }
      connectionRequests.status = status;
      const data = await connectionRequests.save();
      res.json({ message: "Connection request" + status, data });
    } catch (err) {
      res.send("ERROR:" + err.message);
    }
  }
);

module.exports = requestRouter;
