# Real-Time Weather Monitoring System

## Project Overview
This project is a Real-Time Weather Monitoring System that fetches live weather data from the OpenWeatherMap API, processes it to compute daily summaries (averages, maximum, minimum temperatures, and dominant weather conditions), and provides alerting mechanisms when certain thresholds are breached. The system visualizes weather trends and can be customized to fetch weather data at user-defined intervals.

## Key Features
- **Real-Time Data Fetching**: Continuously retrieves weather data for six Indian metros: Delhi, Mumbai, Chennai, Bangalore, Kolkata, and Hyderabad, with customizable time intervals.
- **Weather Data Processing**: Converts temperature values from Kelvin to Celsius and aggregates daily weather data.
- **Threshold-based Alerting**: Configurable thresholds for temperature or specific weather conditions, with alerts triggered when thresholds are exceeded.
- **Data Storage**: Weather data is persisted in a MongoDB database for further analysis and review.
- **Visualization**: Displays daily weather summaries and historical trends using Chart.js or D3.js.

## Installation and Setup

### Prerequisites
- Node.js and npm
- A valid OpenWeatherMap API Key
- MongoDB installed or a cloud MongoDB service (e.g., MongoDB Atlas)

### Steps to Install
1. **Clone the Repository**:
   ```bash
   git clone <your-repository-url>
   cd weather-monitoring-system
   
2. **Install Dependencies**:
- Backend:
 ```bash
   cd backend
   npm install
```
3. **Configure the API Key: Create a .env file in the backend directory with**:
```bash
API_KEY=your-api-key-here
MONGODB_URI=mongodb://your-mongodb-uri
TEMP_THRESHOLD=35  # Example temperature threshold
INTERVAL=300  # Fetch interval in seconds
```

## Test Cases

### 1. System Setup
- **Objective**: Verify that the system starts successfully and connects to the OpenWeatherMap API using a valid API key.

### 2. Data Retrieval
- **Objective**: Simulate API calls at configurable intervals.
- **Verification**: Ensure the system retrieves weather data for the specified locations and correctly parses the response.

### 3. Temperature Conversion
- **Objective**: Test the conversion of temperature values from Kelvin to Celsius (or Fahrenheit) based on user preference.

### 4. Daily Weather Summary
- **Objective**: Simulate a sequence of weather updates for several days.
- **Verification**: Verify that daily summaries are calculated correctly, including average, maximum, minimum temperatures, and dominant weather conditions.

### 5. Alerting Thresholds
- **Objective**: Define and configure user thresholds for temperature or weather conditions.
- **Verification**: Simulate weather data that exceeds or breaches the thresholds, and ensure alerts are triggered only when a threshold is violated.


## Rollups and Aggregates

### 1. Daily Weather Summary
- **Objective**: Roll up the weather data for each day and calculate daily aggregates, including:
  - Average temperature
  - Maximum temperature
  - Minimum temperature
  - Dominant weather condition (determined by the most frequent condition throughout the day)
- **Storage**: Store the daily summaries in a database or persistent storage for further analysis.

### 2. Alerting Thresholds
- **Objective**: Define user-configurable thresholds for temperature or specific weather conditions (e.g., alert if the temperature exceeds 35 degrees Celsius for two consecutive updates).
- **Implementation**: Continuously monitor the latest weather data and compare it against the defined thresholds.
- **Alerts**: If a threshold is breached, trigger an alert for the current weather conditions. Alerts can be displayed in the console or sent through an email notification system (implementation details are left open-ended).

### 3. Implement Visualizations
- **Objective**: Create visualizations to display:
  - Daily weather summaries
  - Historical trends
  - Triggered alerts

## Docker Setup
-**To run in Docker**:

### Build the Docker images:
```Bash
docker build -t weather-monitoring-system-backend ./backend
docker build -t weather-monitoring-system-frontend ./frontend
Use code with caution.
```
### Run the containers:
```Bash
docker run -d -p 3000:3000 weather-monitoring-system-frontend
docker run -d -p 5000:5000 weather-monitoring-system-backend
