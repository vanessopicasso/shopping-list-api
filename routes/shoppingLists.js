const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ShoppingList = require("../models/shoppingList");
const Item = require("../models/item");
const authenticate = require("../middleware/authenticate");
const authorizeListOwner = require("../middleware/authorize");

// Apply authentication middleware globally
router.use(authenticate);

// Create a shopping list
router.post("/createList", authorizeListOwner, async (req, res) => {
  const { name, listOwner } = req.body;

  // Validate input
  if (!name || !listOwner) {
    return res.status(400).json({ error: "Invalid input data. 'name' and 'listOwner' are required." });
  }

  try {
    const newList = new ShoppingList({
      name,
      listOwner,
      items: [],
    });

    await newList.save();

    res.status(201).json({
      message: "Shopping list created successfully.",
      data: newList,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the shopping list." });
  }
});

// Delete a shopping list
router.delete("/:listId", authorizeListOwner, async (req, res) => {
  const { listId } = req.params;

  try {
    const shoppingList = await ShoppingList.findByIdAndDelete(listId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found." });
    }

    res.status(200).json({
      message: "Shopping list deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the shopping list." });
  }
});

// Get a shopping list
router.get("/:listId", async (req, res) => {
  const { listId } = req.params;

  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found." });
    }

    res.status(200).json(shoppingList);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the shopping list." });
  }
});

// Add an item to a shopping list
router.post("/:listId/items", async (req, res) => {
  const { listId } = req.params;
  const { name, quantity } = req.body;

  // Validate input
  if (!name || typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ error: "Invalid input data. 'name' and a positive 'quantity' are required." });
  }

  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found." });
    }

    const newItem = new Item({
      name,
      quantity,
      resolved: false,
    });

    shoppingList.items.push(newItem);
    await shoppingList.save();

    res.status(200).json({
      message: "Item added successfully.",
      data: newItem,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while adding the item." });
  }
});

// Add a member to a shopping list
router.post("/:listId/members", authorizeListOwner, async (req, res) => {
  const { listId } = req.params;
  const { memberId } = req.body;

  if (!memberId) {
    return res.status(400).json({ error: "'memberId' is required." });
  }

  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found." });
    }

    if (shoppingList.members.includes(memberId)) {
      return res.status(400).json({ error: "Member already added." });
    }

    shoppingList.members.push(memberId);
    await shoppingList.save();

    res.status(200).json({
      message: "Member added successfully.",
      data: shoppingList.members,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while adding the member." });
  }
});

// Remove a member from a shopping list
router.delete("/:listId/members", authorizeListOwner, async (req, res) => {
  const { listId } = req.params;
  const { memberId } = req.body;

  if (!memberId) {
    return res.status(400).json({ error: "'memberId' is required." });
  }

  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).json({ error: "Shopping list not found." });
    }

    if (shoppingList.listOwner === memberId) {
      return res.status(400).json({ error: "The owner cannot remove themselves." });
    }

    const index = shoppingList.members.indexOf(memberId);
    if (index === -1) {
      return res.status(404).json({ error: "Member not found." });
    }

    shoppingList.members.splice(index, 1);
    await shoppingList.save();

    res.status(200).json({
      message: "Member removed successfully.",
      data: shoppingList.members,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while removing the member." });
  }
});

module.exports = router;