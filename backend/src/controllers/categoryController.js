const Category = require("../models/Category");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.userId }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name, type, color, icon } = req.body;
    if (!name || !type) return res.status(400).json({ message: "Name and type are required" });

    const newCategory = new Category({
      name,
      type,
      color,
      icon,
      userId: req.user.userId,
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOneAndDelete({ _id: id, userId: req.user.userId });
    if (!category) return res.status(404).json({ message: "Category not found" });
    
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
