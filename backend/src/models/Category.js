const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    color: { type: String, default: "#14b8a6" }, // Default teal-500
    icon: { type: String, default: "currency-dollar" } 
  },
  { timestamps: true }
);

categorySchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model("Category", categorySchema);
