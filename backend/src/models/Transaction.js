const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: false },
    type: { type: String, enum: ["income", "expense"], required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    receiptUrl: { type: String, default: null }, // New feature: attach receipt image
    householdId: { type: mongoose.Schema.Types.ObjectId, ref: "Household", default: null }
  },
  { timestamps: true }
);

// Add indexes for performance optimization
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
