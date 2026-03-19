const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    color: { type: String, default: "#0d9488" },
    householdId: { type: mongoose.Schema.Types.ObjectId, ref: "Household", default: null }
  },
  { timestamps: true }
);

goalSchema.index({ userId: 1 });

module.exports = mongoose.model("Goal", goalSchema);
