const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

// Helper: build query object from request query
async function buildQueryFromReq(req) {
  const { type, minAmount, maxAmount, q, shared } = req.query;
  const userId = req.user?.userId; 

  let query = { userId: new mongoose.Types.ObjectId(userId) };

  if (shared === "true") {
    const user = await User.findById(userId);
    if (user.householdId) {
      // In shared mode, show everything for that household
      query = { householdId: user.householdId };
    }
  } else {
    // In personal mode, only show what belongs to the user AND isn't shared
    query.householdId = null; 
  }

  if (type && type !== "all") {
    query.type = type;
  }

  if (minAmount || maxAmount) {
    query.amount = {};
    if (minAmount) query.amount.$gte = Number(minAmount);
    if (maxAmount) query.amount.$lte = Number(maxAmount);
  }

  if (q && q.trim() !== "") {
    // search in description (case-insensitive)
    query.description = { $regex: q.trim(), $options: "i" };
  }

  return query;
}

// =====================================================
// ADD TRANSACTION
// =====================================================
exports.addTransaction = async (req, res) => {
  try {
    const { description, amount, type, date, shared } = req.body;

    if (!description || amount === undefined || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let householdId = null;
    if (shared) {
      const user = await User.findById(req.user.userId);
      householdId = user.householdId;
    }

    const newTransaction = new Transaction({
      description,
      amount: Number(amount),
      type,
      date: date ? new Date(date) : new Date(),
      userId: req.user.userId,
      householdId
    });

    await newTransaction.save();

    return res.status(201).json({
      message: "Transaction added successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("ADD TRANSACTION ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// =====================================================
// GET TRANSACTIONS (FILTER + SORT + PAGINATION + SEARCH)
// Supports query params:
//  - page (default 1), limit (default 10)
//  - type, minAmount, maxAmount
//  - q (search text for description)
//  - sortBy: latest|oldest|high|low|typeAsc|typeDesc
// =====================================================
exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);
    const skip = (pageNum - 1) * limitNum;

    const query = await buildQueryFromReq(req);

    // sort mapping
    let sort = {};
    switch ((sortBy || "").toString()) {
      case "latest":
        sort = { date: -1 };
        break;
      case "oldest":
        sort = { date: 1 };
        break;
      case "high":
        sort = { amount: -1 };
        break;
      case "low":
        sort = { amount: 1 };
        break;
      case "typeAsc":
        sort = { type: 1 };
        break;
      case "typeDesc":
        sort = { type: -1 };
        break;
      default:
        sort = { date: -1 };
    }

    // total count for pagination
    const total = await Transaction.countDocuments(query);

    const transactions = await Transaction.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    return res.status(200).json({
      transactions,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error("GET TRANSACTIONS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// =====================================================
// UPDATE TRANSACTION
// PUT /transactions/update/:id
// =====================================================
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, type, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid transaction id" });
    }

    const update = {};
    if (description !== undefined) update.description = description;
    if (amount !== undefined) update.amount = Number(amount);
    if (type !== undefined) update.type = type;
    if (date !== undefined) update.date = new Date(date);

    const updated = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { $set: update },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.json({ message: "Updated successfully", transaction: updated });
  } catch (error) {
    console.error("UPDATE TRANSACTION ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// =====================================================
// DELETE TRANSACTION
// DELETE /transactions/delete/:id
// =====================================================
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid transaction id" });
    }

    const deleted = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE TRANSACTION ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// =====================================================
// MONTHLY SUMMARY (basic aggregation example)
// GET /transactions/summary/monthly
// returns income & expense totals per month for last 12 months
// =====================================================
exports.monthlySummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    const pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: { year: "$_id.year", month: "$_id.month" },
          items: {
            $push: { type: "$_id.type", total: "$total" },
          },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ];

    const result = await Transaction.aggregate(pipeline);

    const formatted = result.map((item) => {
      const incomeItem = item.items.find((i) => i.type === "income");
      const expenseItem = item.items.find((i) => i.type === "expense");
      return {
        year: item._id.year,
        month: item._id.month,
        income: incomeItem ? incomeItem.total : 0,
        expense: expenseItem ? expenseItem.total : 0,
      };
    });

    return res.json({ summary: formatted });
  } catch (error) {
    console.error("MONTHLY SUMMARY ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// =====================================================
// GLOBAL SUMMARY (Total Income, Total Expense, Balance)
// GET /transactions/summary
// =====================================================
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    const pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ];

    const result = await Transaction.aggregate(pipeline);

    let totalIncome = 0;
    let totalExpense = 0;

    result.forEach((r) => {
      if (r._id === "income") totalIncome = r.total;
      if (r._id === "expense") totalExpense = r.total;
    });

    return res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  } catch (error) {
    console.error("GET SUMMARY ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// =====================================================
// UPLOAD RECEIPT
// POST /transactions/upload-receipt/:id
// =====================================================
exports.uploadReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const transaction = await Transaction.findOne({ _id: id, userId: req.user.userId });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    transaction.receiptUrl = `/uploads/${req.file.filename}`;
    await transaction.save();

    res.json({ message: "Receipt uploaded successfully", receiptUrl: transaction.receiptUrl });
  } catch (error) {
    console.error("UPLOAD RECEIPT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

