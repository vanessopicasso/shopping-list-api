const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { 
    type: Number, 
    required: true, 
    min: [1, "Quantity must be at least 1"], // Ensures that quantity is a positive number
  },
  resolved: { type: Boolean, default: false },
}, { timestamps: true }); // Tracks creation and update times

module.exports = mongoose.model("Item", itemSchema);