import express from "express";
import cors from "cors";

import "dotenv/config";

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//routes
app.get("/api/health", (req, res) => {
  res.send("server ok");
});

// server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server anda berjalan di http://localhost:${PORT}`);
});
