const mongoose = require("mongoose");
require("dotenv").config();

const mongoConnection = () => {
  mongoose
    .connect(
      `mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PW}@cluster0.kuwu1hh.mongodb.net/${process.env.MONGO_COLLECTION}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Connected to database");
    })
    .catch((e) => {
      console.log(`Error from db.js: ${e}`);
    });
};

module.exports = mongoConnection;
