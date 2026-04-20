const mongoose = require("mongoose");
const User = require("../src/models/User");
require("dotenv").config();

async function checkUsers() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({});
    console.log("Total Users:", users.length);
    users.forEach(u => {
        console.log(`User: ${u.username}, Email: ${u.email}, Verified: ${u.isVerified}`);
    });
    mongoose.connection.close();
}

checkUsers();
