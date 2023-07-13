const express = require("express");
const app = express();
require("dotenv").config();

const { conn } = require("./database.js");
app.use(express.json());

const bookRouter = require("./routes/dogsAndTemperaments.router");

app.use("/", bookRouter);

// app.listen(process.env.PORT, () =>
//   console.log("Server is running on port 5000")
// );

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server is running on port 5000"); // eslint-disable-line no-console
  });
});
// const express = require("express");
// const app = express();

// require("dotenv").config();

// app.use(express.json());

// const bookRouter = require("./routes/dogsAndTemperaments.router");

// app.use("/", bookRouter);

// app.listen(process.env.PORT, () =>
//   console.log("Server is running on port 5000")
// );
