const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT;

const connection = require("./database/db");

connection();

app.use(express.json());
app.use(require("./routes/auth.js"));
app.use(require("./routes/tasks.js"));

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
