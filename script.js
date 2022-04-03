//JQUERY VARIABLES DIRECTING TO ALL ID'S (TO CHOOSE THE CITY, HISTORY, AND FORM)
var searchHistoryList = $("#search-history-list");
var searchCityInput = $("#search-city");
var searchCityButton = $("#search-city-button");
var clearHistoryButton = $("#clear-history");

//JQUERY VARIABLES DIRCTING TO ALL ID'S (FOR CHOSEN CITY)
var currentCity = $("#current-city");
var currentTemp = $("#current-temp");
var currentHumidity = $("#current-humidity");
var currentWindSpeed = $("#current-wind-speed");
var UVindex = $("#uv-index");

//JQUERY VARIABLE FOR 5-DAY FORCAST
var weatherContent = $("#weather-content");

var APIkey = "2e985842de3879dadd49c9909fe5946c"; //ALLOWS ACCESS TO API - SIGN IN TO APP AND CREATE ACCOUNT GET UNIQUE CODE

var cityList = []; //ACCESS THE DATA

var currentDate = moment().format("L");
$("#current-date").text("(" + currentDate + ")");

initializeHistory();
showClear();

$(document).on("submit", function() {
event.preventDefault();

var searchValue = searchCityInput.val().trim();
currentConditionsRequest (searchValue)
searchHistory(searchValue);
searchCityInput.val("");
});

searchCityButton.on("click", function(event) {
    event.preventDefault(); 

var searchValue = searchCityInput.val().trim();

currentConditionsRequest(searchValue)
searchHistory(searchValue);
searchCityInput.val("");
});

clearHistoryButton.on("click", function() {
    cityList = [];
    listArray();
    $(this).addClass("hide");
});

searchHistoryList.on("click", "li.city-btn", function(event){
    var value = $(this).data("value");
    currentConditionsRequest(value);
    searchHistory(value);
});

function currentConditionsRequest(searchValue){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + APIkey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }) .then(function(response) {
        console.log(response);
        currentCity.text(response.name);
        currentCity.append("<small class='text-muted' id='current-date'>");
        $("#current-date").text("(" + currentDate + ")");
        currentCity.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />" )
        currentTemp.text(response.main.temp);
        currentTemp.apped("$deg;F");
        currentHumidity.text(reposnse.main.humidity + "%");
        currentWindSpeed.text(response.wind.speed + "MPH");

        var lat = response.coord.lat;
        var lon = response.coord.lon;

        var UVurl = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;

        $.ajax({
            url: UVurl,
            
        })
    })
}

