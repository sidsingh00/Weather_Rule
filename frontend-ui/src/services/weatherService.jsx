import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const getWeatherSummaries = () => axios.get(`${API_URL}/summaries`);

export const getWeatherAlerts = () => axios.get(`${API_URL}/alerts`);
