const Budget = require("../models/Budget");
const mongoose = require("mongoose");

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.userId }).populate("categoryId");
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addBudget = async (req, res) => {
  try {
    const { categoryId, amount, month } = req.body;
    if (!categoryId || !amount || !month) return res.status(400).json({ message: "All fields are required" });

    // Check if budget already exists for this category & month
    const existing = await Budget.findOne({ userId: req.user.userId, categoryId, month });
    if (existing) {
      existing.amount = amount;
      await existing.save();
      return res.json(existing);
    }

    const newBudget = new Budget({
      categoryId,
      amount,
      month,
      userId: req.user.userId,
    });
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findOneAndDelete({ _id: id, userId: req.user.userId });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    
    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
