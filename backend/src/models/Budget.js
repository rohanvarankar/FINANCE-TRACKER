const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true }, // Format: YYYY-MM
    householdId: { type: mongoose.Schema.Types.ObjectId, ref: "Household", default: null }
  },
  { timestamps: true }
);

// Prevent duplicate budgets for the same category in the same month
budgetSchema.index({ userId: 1, categoryId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);
