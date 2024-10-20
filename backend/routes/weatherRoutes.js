const express = require("express");
const router = express.Router();
const {
  getWeatherData,
  getDailySummaries,
  setAlert,
  getAlerts,
} = require("../controllers/weatherController");

router.get("/weather", getWeatherData);
router.get("/summaries", getDailySummaries);
router.post("/alerts", setAlert);
router.get("/alerts", getAlerts);

module.exports = router;
