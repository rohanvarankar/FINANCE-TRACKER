// backend/src/controllers/transactionController.js
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

// Helper: build query object from request query
function buildQueryFromReq(req) {
  const { type, minAmount, maxAmount, q } = req.query;
  const userId = req.user?.userId; // matches your middleware

  const query = { userId };

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
    const { description, amount, type, date } = req.body;

    if (!description || amount === undefined || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTransaction = new Transaction({
      description,
      amount: Number(amount),
      type,
      date: date ? new Date(date) : new Date(),
      userId: req.user.userId,
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

    const query = buildQueryFromReq(req);

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
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $project: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          amount: 1,
          type: 1,
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month", type: "$type" },
          total: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: { year: "$_id.year", month: "$_id.month" },
          totals: {
            $push: { type: "$_id.type", total: "$total" },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totals: 1,
        },
      },
      { $sort: { year: -1, month: -1 } },
      { $limit: 12 },
    ];

    const rows = await Transaction.aggregate(pipeline);

    // normalize to array of { year, month, income: 0, expense: 0 }
    const result = rows.map((r) => {
      const incomeObj = r.totals.find((t) => t.type === "income");
      const expenseObj = r.totals.find((t) => t.type === "expense");
      return {
        year: r.year,
        month: r.month,
        income: incomeObj ? incomeObj.total : 0,
        expense: expenseObj ? expenseObj.total : 0,
      };
    });

    return res.json({ summary: result });
  } catch (error) {
    console.error("MONTHLY SUMMARY ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
