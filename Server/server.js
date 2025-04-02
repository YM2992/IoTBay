import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// const rateLimit = require("express-rate-limit");
import errorController from "./Controller/errorController.js";

const app = express();

import userRoute from "./Route/userRoute.js";
import productRoute from "./Route/productRoute.js";
dotenv.config({ path: "./Server/config.env" });

app.use(cors({
  origin:"*"
}))

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

// app.use("/api/order", orderRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);

app.use(errorController);

// Server
const port = 8000 || process.env.PORT;

const server = app.listen(port, () => {
  console.log(`app running on ${port}...`);
});
