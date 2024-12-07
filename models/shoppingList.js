const mongoose = require("mongoose");
const Item = require("./item"); // Import the Item model

const shoppingListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  listOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // References User model
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }], // Stores references to Item documents
}, { timestamps: true });

module.exports = mongoose.model("ShoppingList", shoppingListSchema);