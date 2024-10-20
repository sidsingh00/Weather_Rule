const {
  fetchWeatherData,
  calculateDailySummary,
} = require("../services/weatherService");
const nodemailer = require("nodemailer");
const Weather = require("../models/weather");
require("dotenv").config();

const sendAlertEmail = async (email, citiesAboveThreshold) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const cityDetails = citiesAboveThreshold
    .map((city) => `${city.cityName}: ${city.temp.toFixed(2)}°C`)
    .join("\n");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Temperature Alerts for Multiple Cities`,
    text: `The following cities have exceeded the temperature threshold:\n\n${cityDetails}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const getWeatherData = async (req, res) => {
  try {
    const weatherData = await fetchWeatherData();
    res.status(200).json({ success: true, data: weatherData });
  } catch (error) {
    console.error("Error getting weather data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getDailySummaries = async (req, res) => {
  try {
    const summaries = await calculateDailySummary();
    res.status(200).json({ success: true, data: summaries });
  } catch (error) {
    console.error("Error getting daily summaries:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const setAlert = async (req, res) => {
  try {
    const { thresholdTemp, email } = req.body;

    const userThreshold = thresholdTemp || 35;

    const latestWeather = await Weather.find({}).sort({ dt: -1 }).limit(6);

    const cityMap = new Map();

    latestWeather.forEach((weather) => {
      if (weather.temp > userThreshold) {
        if (
          !cityMap.has(weather.cityName) ||
          weather.temp > cityMap.get(weather.cityName)
        ) {
          cityMap.set(weather.cityName, weather.temp);
        }
      }
    });

    const citiesAboveThreshold = Array.from(cityMap, ([cityName, temp]) => ({
      cityName,
      temp,
    }));

    if (citiesAboveThreshold.length > 0 && email) {
      await sendAlertEmail(email, citiesAboveThreshold);
    }

    res.status(200).json({
      success: true,
      message:
        "Alert set. Email sent if any city exceeds the threshold and an email was provided.",
    });
  } catch (error) {
    console.error("Error setting alert:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAlerts = async (req, res) => {
  try {
    const alerts = await Weather.find({}).sort({ dt: -1 }).limit(10);
    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    console.error("Error retrieving alerts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getWeatherData, getDailySummaries, setAlert, getAlerts };
