const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    const models = await genAI.listModels();
    console.log("Available Models:");
    models.slice(0, 10).forEach(m => {
        console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(", ")})`);
    });
  } catch (err) {
    console.error("Error listing models:", err.message);
  }
}

listModels();
