const express = require("express");
const shoppingListsRouter = require("./routes/shoppingLists");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Authorization middleware
function authorize(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "Authorization required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Store decoded user info
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

app.use("/shoppingLists", authorize, shoppingListsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(8000, () => console.log("Server running on http://localhost:8000"));