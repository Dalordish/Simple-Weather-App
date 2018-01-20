//hacky way because too lazy to do callbacks
var lat = 0;
var lon = 0;
var key = "c140a951b626e13ca6866a9c1e917af4"
var current = "M"


var appTemp = 0.0;
var temp = 0.0;
var cloud = 0.0;
var dew = 0.0;
var humid = 0.0;
var wind = 0.0;
var wthr = "";

function roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}


function farenheit(c) {
  return roundToTwo(c * 1.8 + 32);
}

function display(system) {
  if (system === "M") {
    $("#temp").html("Apparent Temperature: " + appTemp + "°C" + " Real Temperature: " + temp + "°C");
    $("#cloud").html("Cloud Cover: " + cloud * 100 + "% " + "Dew Point: " + dew + " °C");
    $("#humidity").html("Humidity: " + humid * 100 + "%");
    $("#wind").html("Wind speed: " + wind + " kmph");
    $("#wthr").html("It is: " + wthr)
  } 
  
  else {
    $("#temp").html("Apparent Temperature: " + farenheit(appTemp) + "°F" + " Real Temperature: " + farenheit(temp) + "°F");
    $("#cloud").html("Cloud Cover: " + cloud * 100 + "% " + "Dew Point: " + farenheit(dew) + " °F");
    $("#humidity").html("Humidity: " + humid * 100 + "%");
    $("#wind").html("Wind speed: " + roundToTwo(wind * 0.621371192) + " mph");
  }
}

function getWeather() {
  $.getJSON('https://api.forecast.io/forecast/' + key + '/' + lat + ',' + lon + "?units=ca" + "&callback=?", function(result) {
    console.log(result);
    appTemp = result.currently.apparentTemperature
    temp = result.currently.temperature
    cloudCover = result.currently.cloudCover
    humid = result.currently.humidity
    dew = result.currently.dewPoint
    wind = result.currently.windSpeed
    wthr = result.currently.summary
    display("M");
  });
}

$(document).ready(function() {
  $.getJSON('https://freegeoip.net/json/', function(result) {
    lat = result.latitude;
    lon = result.longitude;
    $("#ip").html("You are connecting from " + result.ip);
    $("#location").html("This means you are at " + result.city + ", " + result.region_name + ", " + result.zip_code + ", " + result.country_name);
    $("#coordinate").html("Lat : " + lat + " Long : " + lon)
    getWeather();
  })
  .fail(function() {
    console.log("failed :(");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        $("#coordinate").html("Lat : " + lat + " Long : " + lon)
        $("#ip").html("Geoip failed, switching to HTML location...");
        $("#location").html("The weather is currently:");
        getWeather();
      },
      function(error) {
        $("#ip").html("Error: Both Geoip lookup and HTML5 location failed. Try disabling your adblocker or enabling location services.");
        $("#location").html("ERROR");
      });
    }
    else {
      $("#ip").html("Error: Both Geoip lookup and HTML5 location failed. Try disabling your adblocker or enabling location services.");
      $("#location").html("ERROR");
    }
  });

  $("#type").on("click", function() {
    if (current === "M") {
      current = "I"
      display("I");
      $("#type").html("Change Type: (Imperial)")
    } else {
      current = "M"
      display("M");
      $("#type").html("Change Type: (Metric)")
    }

  });
});