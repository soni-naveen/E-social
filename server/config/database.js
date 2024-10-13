const mongoose = require("mongoose");
require("dotenv").config();

exports.database = () => {
  try {
    mongoose.connect(process.env.DATABASE_URL);
    console.log("DB connected successfully");
  } catch (error) {
    console.log("Issue in DB connection");
    console.log(error.message);
    process.exit(1);
  }
};
