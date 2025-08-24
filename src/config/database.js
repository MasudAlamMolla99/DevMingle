const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://masudalammolla99:MasudAlam@cluster0.4xxebvk.mongodb.net/devTinder"
  );
};
module.exports = connectDb;
