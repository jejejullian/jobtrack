import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";

import "dotenv/config";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//routes
app.get("/api/health", (req, res) => {
  res.send("server ok");
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// error handler
app.use(errorHandler);

export default app;
