import { useState, useEffect } from "react";
import axios from "axios";
import "./CityWeather.css";

const CityWeather = () => {
  const [cityWeatherData, setCityWeatherData] = useState([]);
  const [thresholdTemp, setThresholdTemp] = useState("");
  const [email, setEmail] = useState("");
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const convertTemperature = (tempCelsius) => {
    return isFahrenheit ? (tempCelsius * 9) / 5 + 32 : tempCelsius;
  };

  useEffect(() => {
    const fetchWeatherAndSummaryData = async () => {
      try {
        const [weatherResponse, summariesResponse] = await Promise.all([
          axios.get("http://localhost:3001/api/weather"),
          axios.get("http://localhost:3001/api/summaries"),
        ]);

        const summariesMap = summariesResponse.data.data.reduce(
          (acc, summary) => {
            acc[summary._id.cityId] = summary;
            return acc;
          },
          {}
        );

        const combinedData = weatherResponse.data.data.map((weather) => ({
          ...weather,
          summary: summariesMap[weather.cityId],
        }));

        setCityWeatherData(combinedData);
      } catch (error) {
        console.error("Error fetching weather and summary data:", error);
      }
    };

    const fetchAlerts = async () => {
      try {
        const alertsResponse = await axios.get(
          "http://localhost:3001/api/alerts"
        );
        setAlerts(alertsResponse.data.data);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchWeatherAndSummaryData();
    fetchAlerts(); 
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/alerts", {
        thresholdTemp,
        email,
      });
      alert("Alert set successfully!");
      setThresholdTemp("");
      setEmail("");
    } catch (error) {
      console.error("Error setting alert:", error);
    }
  };

  const handleUnitToggle = () => {
    setIsFahrenheit(!isFahrenheit);
  };

  const getWindDirection = (deg) => {
    if (deg > 337.5) return "N";
    if (deg > 292.5) return "NW";
    if (deg > 247.5) return "W";
    if (deg > 202.5) return "SW";
    if (deg > 157.5) return "S";
    if (deg > 122.5) return "SE";
    if (deg > 67.5) return "E";
    if (deg > 22.5) return "NE";
    return "N";
  };

  return (
    <div className="city-weather-container">
      <h1>City Weather Dashboard</h1>
      <form onSubmit={handleFormSubmit} className="alert-form">
        <input
          type="number"
          placeholder="Threshold Temperature (°C)"
          value={thresholdTemp}
          onChange={(e) => setThresholdTemp(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Set Alert</button>
      </form>
      <button className="toggle-temp-button" onClick={handleUnitToggle}>
        Toggle to {isFahrenheit ? "Celsius" : "Fahrenheit"}
      </button>
      <div className="city-weather-grid">
        {cityWeatherData.length > 0 ? (
          cityWeatherData.map((data, index) => {
            const temp = convertTemperature(data?.temp);
            const threshold = parseFloat(thresholdTemp);
            const tempDifference = threshold
              ? (data?.temp - threshold).toFixed(2)
              : null;

            return (
              <div key={index} className="city-weather-box">
                <h3>{data?.cityName}</h3>
                <p>Date: {new Date(data?.dt).toLocaleString()}</p>
                <p>
                  Temperature: {temp?.toFixed(2)}°{isFahrenheit ? "F" : "C"}
                </p>
                <p>
                  Feels Like: {convertTemperature(data?.feels_like)?.toFixed(2)}
                  °{isFahrenheit ? "F" : "C"}
                </p>
                <p>Humidity: {data?.humidity}%</p>
                <p>Wind Speed: {data?.wind_speed} m/s</p>
                <p>
                  Wind Direction: {data.wind_deg}°{" "}
                  {getWindDirection(data.wind_deg)}
                </p>
                <img
                  src={`http://openweathermap.org/img/wn/${data?.icon}.png`}
                  alt="Weather icon"
                />
                <p>Condition: {data?.main}</p>
                {tempDifference !== null && (
                  <p>
                    Difference from Threshold: {tempDifference > 0 ? "+" : ""}
                    {tempDifference}°{isFahrenheit ? "F" : "C"}
                  </p>
                )}
                {data?.summary ? (
                  <div className="city-summary">
                    <h4>Daily Summary</h4>
                    <p>
                      Average Temp:{" "}
                      {convertTemperature(data?.summary?.avgTemp)?.toFixed(2)}°
                      {isFahrenheit ? "F" : "C"}
                    </p>
                    <p>
                      Max Temp:{" "}
                      {convertTemperature(data?.summary?.maxTemp)?.toFixed(2)}°
                      {isFahrenheit ? "F" : "C"}
                    </p>
                    <p>
                      Min Temp:{" "}
                      {convertTemperature(data?.summary?.minTemp)?.toFixed(2)}°
                      {isFahrenheit ? "F" : "C"}
                    </p>
                    <p>Dominant Weather: {data?.summary?.dominantWeather}</p>
                  </div>
                ) : (
                  <p>No summary available.</p>
                )}
              </div>
            );
          })
        ) : (
          <p>No weather data available.</p>
        )}
      </div>
      <h2>Past Alerts</h2>
      <div className="alerts-section">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert._id} className="alert-box">
              <h3>{alert.cityName}</h3>
              <p>Date: {new Date(alert.dt).toLocaleString()}</p>
              <p>Temperature: {alert.temp.toFixed(2)}°C</p>
              <p>Condition: {alert.main}</p>
            </div>
          ))
        ) : (
          <p>No past alerts available.</p>
        )}
      </div>
    </div>
  );
};

export default CityWeather;
