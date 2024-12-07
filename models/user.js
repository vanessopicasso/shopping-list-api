const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"] // Email validation regex
  },
  password: { 
    type: String, 
    required: true, 
    minlength: [6, "Password must be at least 6 characters long"] // Password length validation
  },
  role: { type: String, default: "User" }, // Default role is User
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);