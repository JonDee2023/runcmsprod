const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "https:site.netlify.app",
  credentials: true
}));
app.use(express.json());

const authRoutes = require("./routes/authentication.js");

app.use("/api", authRoutes)

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port ${PORT}");


});