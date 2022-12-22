const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/v1/user.routes");
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("route is working");
});

app.use("/api/v1", userRoutes);

module.exports = app;
