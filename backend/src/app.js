import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";

import "dotenv/config";

import authRoutes from "./routes/authRoutes.js";

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

// error hanlder
app.use(errorHandler);

// server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server anda berjalan di http://localhost:${PORT}`);
});
