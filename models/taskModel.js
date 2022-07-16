const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: "String",
      required: true,
    },
    description: {
      type: "String",
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const tModel = new mongoose.model("Task", taskSchema);

module.exports = tModel;
