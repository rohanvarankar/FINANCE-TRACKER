const mongoose = require("mongoose");

const recurringSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    type: { type: String, enum: ["income", "expense"], required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    frequency: { type: String, enum: ["daily", "weekly", "monthly", "yearly"], required: true },
    nextDue: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

recurringSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model("RecurringTransaction", recurringSchema);
