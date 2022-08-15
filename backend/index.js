// Importing required libraries
const express = require("express")
const utils = require("./utils")
const cors = require("cors")

// Defining default port for app
const PORT = process.env.PORT || 5000

// Creating express instance
const app = express()

// Initializing middlewares
app.use(express.json())
app.use(cors())

// Initializing root endpoint
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is up!",
        status: "1"
    })
})

// API for getting weather data
app.post("/getWeather", async (req, res) => {

    const apiRequests = []
    const cities = req.body.cities;
    
    if(cities == undefined) res.status(401).json({error: "Body not valid", status: 0})
    
    
    for(let i=0; i<cities.length; i++) {
        apiRequests.push(utils.getTempInCel(cities[i]))
    }

    const data = await Promise.all(apiRequests)

    const response = { weather:{} }


    data.forEach(city => {
        if(Object.keys(city)[0] == "error") {
            response.weather[city.city] = "This city does not exist!"
        } else {
            response.weather[Object.keys(city)[0]] = city[Object.keys(city)[0]]
        }
    })

    res.status(200).json(response)
})

// Listening express app
app.listen(PORT, () => console.log("Server started....."))
