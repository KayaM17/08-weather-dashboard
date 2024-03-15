// Create a weather dashboard with form inputs.
// When a user searches for a city, they are presented with current and future conditions for that city.
//Users city search is added to the search history.
//When a user views the current weather conditions for that city, they are presented with the following:
// City name.
// Date.
// Icon representation of weather conditions.
// Temperature, Humidity and Wind speed.
// When user view future weather conditions of any city,
// they are presented with a 5-day forecast that displays:
// Date & Icon representation of weather conditions.
// Temperature & Humidity.
// https://api.openweathermap.org/data/2.5/forecast?lat=51.5072&lon=0.1276&appid=bff363b19166c862e56389c5d311a2c6


$(document).ready(function () {
    // Search history buttons.
    $("#history").on("click", ".history-btns", function () {
        var searchValue = $(this).text();
        getWeather(searchValue);
    });
    // Search button feature.  
    $("#search-form").on("submit", function (event) {
        event.preventDefault();        
        console.log("search button clicked");
        var searchValue = $("#search-input").val().trim();
        // Early return if searchValue is empty
        if (searchValue === "") {
            // Error message in search box it will replace placeholder for 5 seconds
            $("#search-input").attr("placeholder", "Please enter a valid city.");
            setTimeout(function () {
                $("#search-input").attr("placeholder", "Search for a city...");
            }, 3000);
            return; // Stop execution if the search is empty
        }
        // Capitalize the first letter of each word
        searchValue = searchValue.split(" ").map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(" ");
        // Fetch weather
        getWeather(searchValue);        
        // Search history saved to local storage in console
        var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        searchHistory.push(searchValue);
        
        // If search history is more than 6, remove the oldest search
        if (searchHistory.length > 6) {
            searchHistory.shift(); // Only 6 are kept
        }
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        updateHistoryDisplay();       
    });

    function updateHistoryDisplay() {
        var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        $("#history").empty(); // Clear existing buttons
        searchHistory.reverse().forEach(function (searchValue) {
            var htmlHist = `
                <div class="d-grid gap-5 mt-3 historyBtns">
                    <button class="btn history-btns" type="button">${searchValue}</button>
                </div>
            `;
            $("#history").append(htmlHist);
        });
    } 
// Displat history search
    updateHistoryDisplay();  
});
// WEATHER API:
var apiKey = "bff363b19166c862e56389c5d311a2c6"
function getWeather(searchValue) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${apiKey}&units=metric`;
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("CURRENT DAY: ", data);
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            getFiveDays(lat, lon);
            var htmlToday = `
                <div class="card-big">                    
                    <h3>${data.name} (${new Date(data.dt * 1000).getDate().toString().padStart(2, '0')}/${(new Date(data.dt * 1000).getMonth() + 1).toString().padStart(2, '0')}/${new Date(data.dt * 1000).getFullYear()})</h3>
                    <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="weather icons">
                    <p>Temp: ${Math.round(data.main.temp)}°C</p>
                    <p>Wind: ${data.wind.speed} KPH</p>
                    <p>Humidity: ${data.main.humidity} %</p>
                </div>
            `;
            $("#today").html(htmlToday);            
        });
}

function getFiveDays(lat, lon) {
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {    
            // 5 day forecast display
            $("#forecast").html("");        
            for (let i = 0; i < data.list.length; i+=8) {
                let element = data.list[i];
                console.log("FIVE DAYS: ", element);
                var htmlStr = `
                    <div class="card-item">
                        <h3>${element.dt_txt.split(" ")[0].split('-').reverse().join('/')}</h3>
                        <img src="https://openweathermap.org/img/w/${element.weather[0].icon}.png" alt="weather icons">
                        <p>Temp: ${Math.round(element.main.temp)} °C</p>
                        <p>Wind: ${element.wind.speed} KPH</p>
                        <p>Humidity: ${element.main.humidity} %</p>
                    </div>
                `;
                $("#forecast").append(htmlStr);
            }
        });
}
