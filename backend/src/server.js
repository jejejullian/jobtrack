import app from "./app.js";

const PORT = process.env.PORT || 3000;

// start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
