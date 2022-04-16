var city=""; //VARIABLE TO STORE CITY

// JQUERY VARIABLES
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentWindSpeed= $("#wind-speed");
var currentHumidity= $("#humidity");
var currentuvIndex = $("#uv-index");

var storageCity=[];

function find(c) { //SEARCH CITY TO SEE IF IT EXISTS IN STORAGE
  for (var i=0; i < storageCity.length; i++){
  if(c.toUpperCase()===storageCity[i]){
  return -1;
  }
  } return 1;
}

var APIKey="2e985842de3879dadd49c9909fe5946c"; //API KEY

function displayWeather(event){ //DISPLAY CURRENT AND FUTURE WEATHER AFTER GRABBING CITY FROM FORM
event.preventDefault();
  if(searchCity.val().trim()!==""){
  city=searchCity.val().trim();
  currentWeather(city);
}
}

function currentWeather(city){ //AJAX CALL

var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey; //BUILT-IN API REQUEST BY CITY NAME-(CURRENT WEATHER)
$.ajax({
  url:queryURL,
  method:"GET",
}).then(function(response){
console.log(response); //PARSE THE RESPONSE TO DISPLAY CURRENT WEATHER INLCUDING CITY NAME, DATE, & WEATHER ICON.
  var weathericon= response.weather[0].icon; //VARIABLE FOR ICON (LOCAL)
  var iconurl="https://openweathermap.org/img/wn/"+ weathericon +"@2x.png"; //RETRIEVES IMAGE BASED ON WEATHER ABOVE
  var date=new Date(response.dt*1000).toLocaleDateString(); //DATE https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
  $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">"); //PARSE THE RESPONE FOR NAME OF CITY, DATE & WEATHER ICON

  var tempF = (response.main.temp - 273.15) * 1.80 + 32; //PARSE RESPONSE TO DISPLAY CURRENT TEMP
  $(currentTemperature).html((tempF).toFixed(2)+"&#8457"); //CONVERT TO FAHRENHEIT
  $(currentHumidity).html(response.main.humidity+"%"); //DISPLAY THE HUMIDITY

  var ws=response.wind.speed; //VARIABLE FOR WINDSPEED (LOCAL)
  var windsmph=(ws*2.237).toFixed(1); //CONVERT TO MPH
  $(currentWindSpeed).html(windsmph+" MPH"); //PUTS WINDSPEED INTO #WIND-SPEED ID (GLOBAL)

uvIndex(response.coord.lon,response.coord.lat); //DISPLAY UVINDEX USING LAT/LONG IN ORDER TO USE (OPEN-CALL)
forecast(response.id);
  if(response.cod==200){
    storageCity=JSON.parse(localStorage.getItem("cityname"));
    console.log(storageCity);
  if (storageCity==null){
    storageCity=[];
    storageCity.push(city.toUpperCase()
);

localStorage.setItem("cityname",JSON.stringify(storageCity));
addToList(city);
}
else {
if(find(city)>0){

storageCity.push(city.toUpperCase());
localStorage.setItem("cityname",JSON.stringify(storageCity));
addToList(city);
}}}
});
}

function uvIndex(lon,lat){ //FUNCTION TO RETURN UVINDEX
  var uvqURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + APIKey; //API REQUEST FOR UVINDEX (OPEN-CALL) MUST USE LAT/LON
$.ajax({
  url:uvqURL,
  method:"GET"
}).then(function (response) { //VARIABLE TO GRAB CURRENT UVI. IF ELSE TO INDICATE A COLOR BASED ON VALUE
  var uvIndex = response.current.uvi; 
  if (uvIndex < 2) {
    $("#uv-index").addClass("green")
  } else if (uvIndex < 5) {
    $("#uv-index").addClass("yellow")
  } else if (uvIndex < 7) {
    $("#uv-index").addClass("orange")
  } else if (uvIndex < 10) {
    $("#uv-index").addClass("red")
  } else {
    $("#uv-index").addClass("violet")
  }
    $("#uv-index").text(response.current.uvi);
});
}

function forecast(cityid){ //DISPLAY 5-DAY FORECAST
var dayover= false;
var queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey; //BUILT-IN API REQUEST BY CITY NAME - (5 DAY WEATHER FORECAST) HAS BUILT-IN GEOCODING
$.ajax({
  url:queryforcastURL,
  method:"GET"
}).then(function(response){
for (i=0;i<5;i++){
var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString(); 
var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
var tempK= response.list[((i+1)*8)-1].main.temp;
var tempF=(((tempK-273.5)*1.80)+32).toFixed(2); //CHANGE TO FARENHEIGHT
var humidity= response.list[((i+1)*8)-1].main.humidity;
var wind= response.list[((i+1)*8)-1].wind.speed; //WINDSPEED METERS PER SECOND PULLED FROM API
var windS=(wind*2.237).toFixed(1); //CONVERT MILES PER HOUR
$("#futureDate"+i).html(date);
$("#futureIcon"+i).html("<img src="+iconurl+">");
$("#futureTemp"+i).html(tempF+"&#8457");
$("#futureHumidity"+i).html(humidity+"%"); 
$("#futureWindS"+i).html(windS+" MPH");
}
});
}

function addToList(c){ //ADD CITY TO SEARCH HISTORY
  var listEl= $("<li>"+c.toUpperCase()+"</li>");
  $(listEl).attr("class","list-group-item");
  $(listEl).attr("data-value",c.toUpperCase());
  $(".list-group").append(listEl);
}

function pastSearch(event){ //DISPLAY PAST SEARCH WHEN ITEM IS CLICKED IN SEARCH HISTORY
  var liEl=event.target;
  if (event.target.matches("li")){
  city=liEl.textContent.trim();
  currentWeather(city);
}
}

function loadlastCity(){ // RENDER FUNCTION OF CITY SEARCH FROM STORAGE
  $("ul").empty();
  var storageCity = JSON.parse(localStorage.getItem("cityname"));
  if(storageCity!==null){
  storageCity=JSON.parse(localStorage.getItem("cityname"));
  for(i=0;i<storageCity.length;i++){
  addToList(storageCity[i]);
}
  city=storageCity[i-1];
  currentWeather(city);
}
}

function clearHistory(event){ //CLEAR SEARCH HISTORY
  event.preventDefault();
  storageCity=[];
  localStorage.removeItem("cityname");
  document.location.reload();
}

$("#search-button").on("click",displayWeather); //CLICK HANDLERS
$(document).on("click",pastSearch);
$(window).on("load",loadlastCity);
$("#clear-history").on("click",clearHistory);