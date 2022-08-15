// function to create card from data
const cardTemplate = (city, temperature) => ( `
    <div class="col-4">
        <div class="card">
            <div class="card-body">
            <h5 class="card-title">${city}</h5>
            <p class="card-text">${temperature}°C</p>
            </div>
        </div>
    </div>
`)

// function to create alert from given data
const errorAlert = (title, subTitle) => (`
    <div class="alert alert-danger alert-dismissible fade show text-capitalize" role="alert">
        <strong>${title}</strong> - ${subTitle}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
`)

// Select required elemnts from DOM
let cardSection = document.getElementById("card-section")
let alertSection = document.getElementById("alert-secton")

document.getElementById("submit-form").addEventListener('click', async (event) => {

    // Disables button after form submission so user don't spam
    event.target.classList.add('disabled')

    // Prevents page from refreshing
    event.preventDefault()

    cardSection.innerHTML = ''
    alertSection.innerHTML = ''

    // Get input data and seperate with comma
    let cities = document.getElementById("cities-input").value.trim().split(",")

    // Removes empty from input array
    cities = cities.filter(x => x)

    // Shows error if no data is inputed
    if(cities.length == 0) {
        alertSection.innerHTML += errorAlert("City Names Can't Be Empty", "Please enter city names")
        event.target.classList.remove('disabled')
        return
    }

    const body = {
        cities: cities
    }

    // Make API call to fetch data
    let result = await fetch("http://127.0.0.1:5000/getWeather", {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    // Parse data to make it redable by JavaScript
    let data = JSON.parse(await result.text())

    // Validate and render data
    if(result.status == 200) {
        for(let temp in data.weather) {
            if(data.weather[temp] == "This city does not exist!") {
                alertSection.innerHTML += errorAlert(temp, data.weather[temp])
            } else {
                cardSection.innerHTML += cardTemplate(temp, data.weather[temp])
            }
        }
    } else {
        alertSection.innerHTML += errorAlert("Bad request", "Or may be error in server")
    }

    // Make submit button not disabled
    event.target.classList.remove('disabled')
})