// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import errorController from "./Controller/errorController.js";

// Routes
import userRoute from "./Route/userRoute.js";
import productRoute from "./Route/productRoute.js";
import cartRoute from "./Route/cartRoute.js";

// Load env vars
dotenv.config({ path: "./Server/config.env" });

const app = express();

// CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.options("*", cors());


// Body parsers

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Logger for debugging
app.use((req, res, next) => {
  console.log(`Hit ${req.method} ${req.originalUrl}`);
  console.log("Query:", req.query);
  console.log("Params:", req.params);
  console.log("Body:", req.body);
  next();
});

// Routes
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);

// Error handler
app.use(errorController);

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
