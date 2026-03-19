const RecurringTransaction = require("../models/RecurringTransaction");
const Transaction = require("../models/Transaction");

exports.getRecurring = async (req, res) => {
  try {
    const items = await RecurringTransaction.find({ userId: req.user.userId })
      .populate("categoryId")
      .sort({ nextDue: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addRecurring = async (req, res) => {
  try {
    const { type, description, amount, frequency, nextDue, categoryId } = req.body;
    if (!type || !description || !amount || !frequency || !nextDue) {
      return res.status(400).json({ message: "All fields required" });
    }
    const newItem = new RecurringTransaction({
      userId: req.user.userId,
      type,
      description,
      amount,
      frequency,
      nextDue,
      categoryId: categoryId || null,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mark as paid: creates a transaction entry and advances nextDue
exports.markPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await RecurringTransaction.findOne({ _id: id, userId: req.user.userId });
    if (!item) return res.status(404).json({ message: "Not found" });

    // Create the actual transaction
    const tx = new Transaction({
      userId: req.user.userId,
      categoryId: item.categoryId,
      type: item.type,
      description: item.description,
      amount: item.amount,
      date: new Date(),
    });
    await tx.save();

    // Advance nextDue
    const next = new Date(item.nextDue);
    switch (item.frequency) {
      case "daily":   next.setDate(next.getDate() + 1); break;
      case "weekly":  next.setDate(next.getDate() + 7); break;
      case "monthly": next.setMonth(next.getMonth() + 1); break;
      case "yearly":  next.setFullYear(next.getFullYear() + 1); break;
    }
    item.nextDue = next;
    await item.save();

    res.json({ message: "Transaction logged and due date advanced", transaction: tx, nextDue: item.nextDue });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleActive = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await RecurringTransaction.findOne({ _id: id, userId: req.user.userId });
    if (!item) return res.status(404).json({ message: "Not found" });
    item.isActive = !item.isActive;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteRecurring = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await RecurringTransaction.findOneAndDelete({ _id: id, userId: req.user.userId });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
