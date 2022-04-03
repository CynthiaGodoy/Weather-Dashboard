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

currentConditionRequest (searchValue)
searchHistory(searchValue);
searchCityInput.val("");
});