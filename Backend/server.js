require("dotenv").config();

const cors = require("cors");
const app = require("./src/app");
const connectToDB = require("./src/config/database");

const PORT = process.env.PORT || 3000;

// Apply middleware
app.use(cors());

/**
 * Server Initialization Function
 */
async function startServer() {
  try {
    // 1. Connect to Database first
    await connectToDB();
    console.log("✅ Database connected successfully");

    // 2. Start HTTP Server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        "🔑 Gemini API Key exists:",
        Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY)
      );
    });

    server.on("error", (err) => {
      console.error("❌ Server runtime error:", err.message);
    });
  } catch (error) {
    console.error("❌ Failed to initialize application:", error.message);
    process.exit(1);
  }
}

// Start application
startServer();
