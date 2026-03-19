const Household = require("../models/Household");
const User = require("../models/User");

exports.createHousehold = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (user.householdId) return res.status(400).json({ message: "Already in a household" });

    const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const household = new Household({
      name,
      admin: userId,
      members: [userId],
      inviteCode
    });

    await household.save();

    user.householdId = household._id;
    await user.save();

    res.status(201).json({ message: "Household created", household });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.joinHousehold = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user.userId;

    const household = await Household.findOne({ inviteCode });
    if (!household) return res.status(404).json({ message: "Invalid invite code" });

    const user = await User.findById(userId);
    if (user.householdId) return res.status(400).json({ message: "Already in a household" });

    household.members.push(userId);
    await household.save();

    user.householdId = household._id;
    await user.save();

    res.json({ message: "Joined household successfully", household });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getHousehold = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("householdId");
    
    if (!user.householdId) return res.json({ household: null });

    const household = await Household.findById(user.householdId._id).populate("members", "username email avatarUrl");
    res.json({ household });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.leaveHousehold = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user.householdId) return res.status(400).json({ message: "Not in a household" });

    const household = await Household.findById(user.householdId);
    if (household.admin.toString() === userId.toString()) {
        return res.status(400).json({ message: "Admin cannot leave. Dissolve household or transfer ownership first." });
    }

    household.members = household.members.filter(m => m.toString() !== userId.toString());
    await household.save();

    user.householdId = null;
    await user.save();

    res.json({ message: "Left household" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
