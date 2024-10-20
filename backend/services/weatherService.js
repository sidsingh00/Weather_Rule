const axios = require("axios");
const Weather = require("../models/weather");

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const CITY_IDS = [
  { id: "1273294", name: "Delhi" },
  { id: "1275339", name: "Mumbai" },
  { id: "1264527", name: "Chennai" },
  { id: "1277333", name: "Bangalore" },
  { id: "1275004", name: "Kolkata" },
  { id: "1269843", name: "Hyderabad" },
];

const fetchWeatherData = async () => {
  try {
    const responses = await Promise.all(
      CITY_IDS.map((city) =>
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?id=${city.id}&appid=${API_KEY}`
        )
      )
    );

    const weatherData = responses.map((response, index) => {
      const { main, weather, dt, wind } = response.data;
      return {
        cityId: CITY_IDS[index].id,
        cityName: CITY_IDS[index].name,
        main: weather[0].main,
        temp: main.temp - 273.15,
        feels_like: main.feels_like - 273.15,
        humidity: main.humidity,
        wind_speed: wind.speed,
        wind_deg: wind.deg,
        icon: weather[0].icon,
        dt: new Date(dt * 1000),
      };
    });

    await storeWeatherData(weatherData);

    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

const storeWeatherData = async (weatherData) => {
  try {
    for (const data of weatherData) {
      const weather = new Weather(data);
      await weather.save();
    }
  } catch (error) {
    console.error("Error storing weather data:", error);
  }
};

const calculateDailySummary = async () => {
  try {
    const summaries = await Weather.aggregate([
      {
        $group: {
          _id: {
            cityId: "$cityId",
            cityName: "$cityName",
            date: { $dateToString: { format: "%Y-%m-%d", date: "$dt" } },
          },
          avgTemp: { $avg: "$temp" },
          maxTemp: { $max: "$temp" },
          minTemp: { $min: "$temp" },
          dominantWeather: { $first: "$main" },
        },
      },
      { $sort: { "_id.date": -1 } },
    ]);

    return summaries;
  } catch (error) {
    console.error("Error calculating daily summary:", error);
  }
};

module.exports = { fetchWeatherData, calculateDailySummary };
