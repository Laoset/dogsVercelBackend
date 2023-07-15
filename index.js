const express = require("express");
const app = express();
require("dotenv").config();

const { conn } = require("./database.js");
app.use(express.json());
// Middleware de CORS
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://deploy-perritos.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
const bookRouter = require("./routes/dogsAndTemperaments.router");

app.use("/", bookRouter);

conn.sync({ force: true }).then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server is running on port 5000"); // eslint-disable-line no-console
  });
});
