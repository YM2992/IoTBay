import dotenv from "dotenv";
import cors from "cors";

// const rateLimit = require("express-rate-limit");
import errorController from "./Controller/errorController.js";
dotenv.config({ path: "./Server/config.env" });
import express from "express";

const app = express();

import userRoute from "./Route/userRoute.js";
import paymentRoute from "./Route/paymentRoute.js";
import productRoute from "./Route/productRoute.js";
import cartRoute from "./Route/cartRoute.js";
import orderRoute from "./Route/orderRoute.js";
import checkoutRoute from './Route/checkoutRoute.js';
import addressRoute from "./Route/addressRoute.js";

dotenv.config({ path: "./Server/config.env" });

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(function (req, res, next) {
  console.log("Query:", req.query);
  console.log("Params:", req.params);
  console.log("Body:", req.body);
  next();
});

// app.use("/api/order", orderRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use('/api/checkout', checkoutRoute);
app.use("/api/address", addressRoute);

app.use(errorController);

// Server
const port = 8000 || process.env.PORT;

const server = app.listen(port, () => {
  console.log(`app running on ${port}...`);
});

// locahost:8000/api/user/login
// root
