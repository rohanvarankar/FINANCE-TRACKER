const Goal = require("../models/Goal");

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.userId }).sort({ deadline: 1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline, color } = req.body;
    if (!title || !targetAmount || !deadline) return res.status(400).json({ message: "Required fields missing" });

    const newGoal = new Goal({
      title,
      targetAmount,
      deadline,
      color,
      userId: req.user.userId,
    });
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentAmount } = req.body;
    
    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { $set: { currentAmount } },
      { new: true }
    );

    if (!goal) return res.status(404).json({ message: "Goal not found" });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findOneAndDelete({ _id: id, userId: req.user.userId });
    if (!goal) return res.status(404).json({ message: "Goal not found" });
    
    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
