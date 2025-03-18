import express from "express";
import dotenv from "dotenv";
// const rateLimit = require("express-rate-limit");
// const globalErrHandler = require("./Controller/errorController");

const app = express();

import userRoute from "./Route/userRoute.js";

// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, please try again in an hour!",
// });
// app.use("/api", limiter);

dotenv.config({ path: "./Server/config.env" });

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(function (req, res, next) {
  console.log("Query:", req.query);
  console.log("Params:", req.params);
  console.log("Body:", req.body);
  next();
});

dotenv.config({ path: "./Server/config.env" });

// app.use("/api/products", productRoute);
// app.use("/api/order", orderRoute);
app.use("/api/user", userRoute);

// app.use(globalErrHandler);

// Server
const port = 8000 || process.env.PORT;

const server = app.listen(port, () => {
  console.log(`app running on ${port}...`);
});
