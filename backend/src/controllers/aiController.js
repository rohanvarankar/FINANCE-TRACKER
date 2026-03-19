const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const Category = require("../models/Category");
const Goal = require("../models/Goal");
const mongoose = require("mongoose");

// 🔹 Reusable GROQ API call function (OpenAI-compatible Direct Fetch)
const callGroq = async (apiKey, messages, jsonMode = false) => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: messages,
      temperature: 0.1, // Lower temperature for more accurate extraction
      response_format: jsonMode ? { type: "json_object" } : undefined
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Groq API Error");
  }

  return data.choices?.[0]?.message?.content || "No response";
};

// ================= AI ADVISOR =================
exports.getAdvisorInsight = async (req, res) => {
  try {
    const userId = req.user.userId;
    const apiKey = process.env.GROQ_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        advice: "AI Advisor is currently in offline mode.",
        status: "offline",
      });
    }

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const transactions = await Transaction.find({ userId, date: { $gte: startOfMonth } }).populate("categoryId");
    const budgets = await Budget.find({ userId }).populate("categoryId");
    const goals = await Goal.find({ userId });

    const promptText = `
      Analyze current month data:
      Transactions: ${transactions.map(t => `${t.type}: ₹${t.amount} (${t.categoryId?.name})`).join(", ")}
      Budgets: ${budgets.map(b => `${b.categoryId?.name}: limit ₹${b.amount}`).join(", ")}
      Goals: ${goals.map(g => `${g.title}: ₹${g.currentAmount}/₹${g.targetAmount}`).join(", ")}
      Provide 3 concise tips.
    `;

    const messages = [{ role: "system", content: "You are a financial advisor. Use ₹." }, { role: "user", content: promptText }];
    const text = await callGroq(apiKey, messages);
    res.json({ advice: text, status: "live" });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch AI insights" });
  }
};

// ================= CHATBOT =================
exports.getChatbotResponse = async (req, res) => {
  try {
    const { message, history } = req.body;
    const userId = req.user.userId;
    const apiKey = process.env.GROQ_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ message: "GROQ_API_KEY missing" });

    const transactions = await Transaction.find({ userId }).sort({ date: -1 }).limit(10).populate("categoryId");
    const summary = await Transaction.aggregate([{ $match: { userId: new mongoose.Types.ObjectId(userId) } }, { $group: { _id: "$type", total: { $sum: "$amount" } } }]);

    const context = `Finance Chatbot. Totals: ${summary.map(s => `${s._id}: ₹${s.total}`).join(", ")}. Recent: ${transactions.map(t => `${t.description} (₹${t.amount})`).join("; ")}. Keep answers short. Use ₹.`;
    const groqMessages = [{ role: "system", content: context }, ...history.map(h => ({ role: h.role === "user" ? "user" : "assistant", content: h.content })), { role: "user", content: message }];
    const reply = await callGroq(apiKey, groqMessages);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: "Chatbot error." });
  }
};

// ================= TRANSACTION EXTRACTION (VOICE/TEXT) =================
exports.processTransactionText = async (req, res) => {
  try {
    const { text } = req.body;
    const apiKey = process.env.GROQ_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ message: "GROQ_API_KEY missing" });

    const prompt = `
      Extract financial data from this text: "${text}"
      Current Year: ${new Date().getFullYear()}
      Today's Date: ${new Date().toISOString().split('T')[0]}
      
      Return a JSON object:
      {
        "type": "income" or "expense",
        "description": "Short description",
        "amount": number,
        "date": "YYYY-MM-DD",
        "category_suggestion": "food|shopping|travel|entertainment|healthcare|utilities|other"
      }
      If not specified, use today's date. Default type is "expense".
    `;

    const messages = [
      { role: "system", content: "You are a transaction extraction engine. Return JSON only." },
      { role: "user", content: prompt }
    ];

    const response = await callGroq(apiKey, messages, true);
    const result = JSON.parse(response);
    res.json(result);
  } catch (error) {
    console.error("TEXT EXTRACTION ERROR:", error.message);
    res.status(500).json({ message: "Failed to parse text." });
  }
};