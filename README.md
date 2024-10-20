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


