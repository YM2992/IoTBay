// const express = require("express");
import express from "express";
// const rateLimit = require("express-rate-limit");
// const globalErrHandler = require("./Controller/errorController");

import dotenv from "dotenv";
// const dotenv = require("dotenv");
// const path = require("path");

const app = express();

// const productRoute = require("./Routes/productRoutes");
// const orderRoute = require("./Routes/orderRoutes");
// const userRoute = require("./Routes/userRoutes");

// app.use(express.static(path.join(__dirname, "Utils")));

// app.use(
//   helmet.contentSecurityPolicy({
//     useDefaults: true,
//     directives: {
//       "default-src": ["'self'"],
//       "connect-src": ["'self'", "*"],
//       "img-src": ["'self'", "https: data:"],
//       "script-src": ["'self'", "https: data:"],
//       "frame-src": ["*"],
//     },
//   })
// );

// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, please try again in an hour!",
// });
// app.use("/api", limiter);

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
// app.use("/api/user", userRoute);

// app.use(globalErrHandler);

// const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

// Server
const port = 8000 || process.env.PORT;

const server = app.listen(port, () => {
  console.log(`app running on ${port}...`);
});
