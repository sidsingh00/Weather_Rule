require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const weatherRoutes = require("./routes/weatherRoutes");
const cron = require("node-cron");
const cors = require("cors");
const {
  fetchWeatherData,
  calculateDailySummary,
} = require("./services/weatherService");

const app = express();
app.use(cors());

connectDB();

app.use(express.json());

app.use("/api", weatherRoutes);

// Schedule the task to run every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  console.log("Fetching weather data...");
  await fetchWeatherData();
  await calculateDailySummary();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
