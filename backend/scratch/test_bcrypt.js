const bcrypt = require("bcrypt");
const SALT_ROUNDS = 8;

async function testAuth() {
    const password = "Password123!";
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    console.log("Password:", password);
    console.log("Hash:", hash);

    const isMatch = await bcrypt.compare(password, hash);
    console.log("Match:", isMatch);

    const isMatchWrong = await bcrypt.compare("wrong", hash);
    console.log("Match Wrong:", isMatchWrong);
}

testAuth();
