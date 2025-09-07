const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: ["ignore", "interested", "accepted", "rejected"],
      message: `{VALUE} is incorrect status type`,
    },
  },
});

module.exports = mongoose.model("ConnectRequest", connectionRequestSchema);
