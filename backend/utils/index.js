// Importing required libraries
const dotenv = require("dotenv")
const axios = require("axios").default

// Configure environment variables
dotenv.config()

const API_KEY = process.env.API_KEY

// helper functions
function convertKelvinToCelcius(kelvinTemp) {
    return Math.round(kelvinTemp - 273.15)
}

module.exports = {
    getTempInCel : async function(cityName) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
        
        return axios.get(url).then(result => {
            const payload = {
                [result.data.name]: convertKelvinToCelcius(result.data.main.temp)
            }
            return payload
        }).catch(error => {
            return {error: error.message, city: cityName}
        })
    },
}