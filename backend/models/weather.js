const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    cityId: String,
    cityName: String,
    main: String,
    temp: Number,
    feels_like: Number,
    humidity: Number,
    wind_speed: Number,
    wind_deg: Number,
    icon: String,
    dt: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;
