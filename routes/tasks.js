const express = require("express");
const router = express.Router();
const { checkFunction } = require("../middleware/check");
const tModel = require("../models/taskModel");

router.post("/tasks", checkFunction, (req, res) => {
  const { title, description } = req.body;
  const newTask = new tModel({
    title,
    description,
    postedBy: req.user,
  });
  newTask
    .save()
    .then((result) => {
      id = result._id;
      res.status(201).json({ id, Message: "Succesfully added" });
    })
    .catch((e) => {
      res.status(404).json({ Error: e });
    });
});

router.get("/mytasks", checkFunction, (req, res) => {
  tModel
    .find({ postedBy: req.user._id })
    .populate("postedBy", "name")
    .then((tasks) => {
      res.status(200).json({ tasks });
    })
    .catch((e) => {
      res.status(404).json({ Error: e });
    });
});

router.patch("/update/:taskId", checkFunction, (req, res) => {
  tModel
    .findOne({ _id: req.params.taskId })
    .populate("postedBy", "email")
    .exec((err, task) => {
      if (err || !task) {
        return res.status(400).json({ Error: "Invalid task...." });
      } else if (task.postedBy.email.toString() === req.user.email.toString()) {
        const { title, description } = req.body;
        tModel.updateOne(
          { _id: req.params.taskId },
          {
            title,
            description,
          }
        );
        res.status(200).json({ Message: "Updated", task });
      }
    });
});

router.delete("/delete/:taskId", checkFunction, (req, res) => {
  tModel
    .findOne({ _id: req.params.taskId })
    .populate("postedBy", "email")
    .exec((err, task) => {
      if (err || !task) {
        return res.status(400).json({ Error: "Task not found..." });
      } else if (task.postedBy.email.toString() !== req.user.email.toString()) {
        return res.status(400).json({ Error: "Invalid request" });
      }
      task
        .remove()
        .then((result) => {
          res.status(200).json({ Message: "Deleted ssuccessfully" });
        })
        .catch((e) => {
          res.status(200).json({ Erro: e });
        });
    });
});

module.exports = router;
