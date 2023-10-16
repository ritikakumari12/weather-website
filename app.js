/*-----Variables-----*/
const key = "984f6ed8f9e27c7714d16b05206acbce";
let forecastDay = 0, previousDay = 0;
let latitudeVal, longitudeVal, currdt;
let locationForm = document.getElementById("location-form");
let locationVal = document.getElementById("location-input");
/*-----Variables-----*/

getLocation();
locationForm.addEventListener("submit", geocode);

/*-----Get current location coordinates-----*/
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  latitudeVal = position.coords.latitude.toFixed(2);
  longitudeVal = position.coords.longitude.toFixed(2);
  let latitude = document.getElementById("latitude");
  let longitude = document.getElementById("longitude");
  let dir_lat = " N",
    dir_lon = " E";
  if (latitudeVal < 0) dir_lat = " S";
  if (longitudeVal < 0) dir_lon = " W";

  latitude.innerText = "Lat - " + Math.abs(latitudeVal) + dir_lat + " / ";
  longitude.innerText = "Lon - " + Math.abs(longitudeVal) + dir_lon;
  getWeather(latitudeVal, longitudeVal);
}
/*-----Get current location coordinates-----*/

/*-----Get search location coordinates-----*/
async function geocode(e) {
  e.preventDefault();


  /*openweathermap geocode*/
  // request = "http://api.openweathermap.org/geo/1.0/direct?q=" + locationVal.value + "&appid=" + key;



  /* Free Open Geocode */
  request = "https://geocode.maps.co/search?q=" + locationVal.value;

  await fetch(request)
    .then((response) => response.json())
    .then((coords) => {

      /*openweathermap geocode*/
      // let coordLocation = coords[0].name;

      /* Free Open Geocode */
      let coordLocation = coords[0].display_name;


      locationVal.value = coordLocation;
      let latitude = document.getElementById("latitude");
      let longitude = document.getElementById("longitude");
      latitudeVal = parseFloat(coords[0].lat).toFixed(2);
      longitudeVal = parseFloat(coords[0].lon).toFixed(2);
      
      forecastDay = 0; 
      previousDay = 0;

      let dir_lat = " N",
        dir_lon = " E";
      if (latitudeVal < 0) dir_lat = " S";
      if (longitudeVal < 0) dir_lon = " W";

      latitude.innerText = "Lat - " + Math.abs(latitudeVal) + dir_lat + " / ";
      longitude.innerText = "Lon - " + Math.abs(longitudeVal) + dir_lon;
      getWeather(latitudeVal, longitudeVal);
    })
    .catch(error => console.log(error));
}
/*-----Get search location coordinates-----*/

/*-----forecast for next day-----*/
function forwardBtn() {
  if(previousDay){
    previousDay -= 1;
    getWeatherReport(latitudeVal, longitudeVal);
  } else if(forecastDay<7){
    forecastDay += 1;
    getWeatherForecast(latitudeVal, longitudeVal);
  }

  if(forecastDay>=8)
    document.getElementById('forwardButton').disabled;
}
/*-----forecast for next day-----*/

/*-----forecast for previous day-----*/
function backwardBtn() {
  if(forecastDay){
    forecastDay -= 1;
    getWeatherForecast(latitudeVal, longitudeVal);
  } else if(previousDay<5) {
    previousDay += 1;
    getWeatherReport(latitudeVal, longitudeVal);
  }

  if(previousDay>5)
    document.getElementById('backwardButton').disabled;
}
/*-----forecast for previous day-----*/

/*-----get weather data-----*/

// Get Future Data
function getWeatherForecast(lat, lng) {
  requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=current,minutely,hourly&appid=${key}`;
  fetch(requestUrl)
    .then((response) => response.json())
    .then(showWeatherForecast)
    .catch(error => console.log(error));
}

// Set Forecast fetched data to HTML
function showWeatherForecast(weather) {

  let temperaturePlaceholder = document.getElementById("temp");
  const temp_day = weather.daily[forecastDay].temp.day - 273.15;
  temperaturePlaceholder.innerHTML = `${Math.round(temp_day)}&deg;C`;

  let minTempPlaceholder = document.getElementById("min");
  const temp_min = weather.daily[forecastDay].temp.min - 273.15;
  minTempPlaceholder.innerHTML = `${Math.floor(temp_min)}&deg;C`;

  let maxTempPlaceholder = document.getElementById("max");
  const temp_max = weather.daily[forecastDay].temp.max - 273.15;
  maxTempPlaceholder.innerHTML = `${Math.ceil(temp_max)}&deg;C`;

  let weatherType = document.getElementById("weather");
  weatherType.innerText = `${weather.daily[forecastDay].weather[0].main.toUpperCase()}`;

  setBackgroundImage(weather.daily[forecastDay].weather[0].main);

  let date = document.getElementById("date");
  let dx = weather.daily[forecastDay].dt;
  date.innerText = timeConverter(dx);

  let day = document.getElementById("day");
  day.innerText = daydisplay(dx);

  let wind = document.getElementById("wind");
  wind.innerHTML = `${(weather.daily[forecastDay].wind_speed * 3.6).toFixed(2)} km/hr`;

  let preci = document.getElementById("preci");
  preci.innerText = `${weather.daily[forecastDay].humidity} %`;

  let icon = weather.daily[forecastDay].weather[0].icon;
  document.getElementById("icon").src = "icons/" + icon + ".png";
  currdt = weather.daily[0].dt;
}

// Get Past Data
function getWeatherReport(lat, lng) {
  let dtdata = currdt - previousDay * 86400;
  requestUrl = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lng}&dt=${dtdata}&appid=${key}`;
  fetch(requestUrl)
    .then((weather) => {
      return weather.json();
    })
    .then(showWeatherReport)
    .catch(error => console.log(error));
}

// Set Past fetched data to HTML
function showWeatherReport(weather) {
  let temperature = document.getElementById("temp");
  temperature.innerHTML = `${Math.round(weather.current.temp - 273.15)}&deg;C`;

  let weatherType = document.getElementById("weather");
  weatherType.innerText = `${weather.current.weather[0].main.toUpperCase()}`;

  setBackgroundImage(weather.current.weather[0].main);

  let date = document.getElementById("date");
  let dx = weather.current.dt;
  date.innerText = timeConverter(dx);

  let day = document.getElementById("day");
  day.innerText = daydisplay(dx);

  let wind = document.getElementById("wind");
  wind.innerHTML = `${(weather.current.wind_speed * 3.6).toFixed(2)} km/hr`;

  let preci = document.getElementById("preci");
  preci.innerText = `${weather.current.humidity} %`;

  let icon = weather.current.weather[0].icon;
  document.getElementById("icon").src = "icons/" + icon + ".png";
  document.querySelector(".cont2").style.display = "none";
}

// Get Current Data
function getWeather(lat, lng) {
  baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
  let request = baseUrl + "lat=" + lat + "&lon=" + lng + "&appid=" + key;
  fetch(request)
    .then((weather) => weather.json())
    .then(showWeather)
    .catch(error => console.log(error));
}

// Set Currently fetched data to HTML
function showWeather(weather) {
  let place = document.getElementById("place");
  place.innerText = `${weather.name},${weather.sys.country}`;
  let temperature = document.getElementById("temp");
  temperature.innerHTML = `${Math.round(
    weather.main.temp - 273.15
  )}&deg;C`;

  let minTemp = document.getElementById("min");
  minTemp.innerHTML = `${Math.floor(
    weather.main.temp_min - 273.15
  )}&deg;C`;
  let maxTemp = document.getElementById("max");
  maxTemp.innerHTML = `${Math.ceil(
    weather.main.temp_max - 273.15
  )}&deg;C`;

  let weatherType = document.getElementById("weather");
  weatherType.innerText = `${weather.weather[0].main.toUpperCase()}`;

  setBackgroundImage(weather.weather[0].main);

  let date = document.getElementById("date");
  let dx = weather.dt;
  date.innerText = timeConverter(dx);

  let day = document.getElementById("day");
  day.innerText = daydisplay(dx);

  let wind = document.getElementById("wind");
  wind.innerHTML = `${(weather.wind.speed * 3.6).toFixed(2)} km/hr`;

  let preci = document.getElementById("preci");
  preci.innerText = `${weather.main.humidity} %`;

  let icon = weather.weather[0].icon;
  document.getElementById("icon").src = "icons/" + icon + ".png";
  currdt = weather.dt;
  document.querySelector(".cont2").style.display = "block";
}
/*-----get weather data-----*/

/*-----set date-----*/
function timeConverter(UNIX_timestamp) {
  let a = new Date(UNIX_timestamp * 1000);
  let year = a.getFullYear();
  let month = (a.getMonth() < 9 ? "0" : null) + (a.getMonth() + 1);
  let date = a.getDate();
  let time = date + "/" + month + "/" + year;
  return time;
}
/*-----set date-----*/

/*-----set day-----*/
function daydisplay(UNIX_timestamp) {
  let b = new Date(UNIX_timestamp * 1000);
  weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let n = weekday[b.getDay()];
  n = n.toUpperCase();
  return n;
}
/*-----set day-----*/

/*-----set Background Image-----*/
const weatherImage = {
  clear: 1,
  clouds: 1,
  drizzle: 1,
  fog: 1,
  haze: 1,
  rain: 1,
  snow: 1,
  thunderstorm: 1,
};

function setBackgroundImage(weatherName) {
  if (weatherImage[weatherName.toLowerCase()] == 1) {
    document.body.style.backgroundImage =
      "url(/images/" + weatherName.toLowerCase() + ".jpg)";
  } else {
    document.body.style.backgroundImage = "url(/images/bg.jpg)";
  }
}
/*-----set Background Image-----*/

/*-----Add Swiping-----*/
const swipeArea = document.getElementById('weather-body');

let touchStartX = 0;
let touchEndX = 0;

swipeArea.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

swipeArea.addEventListener('touchmove', (e) => {
    touchEndX = e.touches[0].clientX;
});

swipeArea.addEventListener('touchend', () => {
    const deltaX = touchEndX - touchStartX;
    const swipeThreshold = 50;

    if (deltaX > swipeThreshold) {
        // Right Swipe
        backwardBtn()
      } else if (deltaX < -swipeThreshold) {
        // Left Swipe
        forwardBtn()
    }
});

/*-----Add Swiping-----*/