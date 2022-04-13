/*-----Variables-----*/
let ele = 0,
  y = 0,
  z = 1;
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
  getWeatherReport(latitudeVal, longitudeVal);
}
/*-----Get current location coordinates-----*/

/*-----Get search location coordinates-----*/
async function geocode(e) {
  e.preventDefault();
  api = "db306b7af7a04077bca3c5fd8efb0594";
  request =
    "https://api.opencagedata.com/geocode/v1/json?q=" +
    locationVal.value +
    "&key=" +
    api;
  await fetch(request)
    .then((response) => response.json())
    .then((coords) => {
      // console.log(coords);
      let coordLocation = coords.results[0].formatted;
      locationVal.value = coordLocation;
      let latitude = document.getElementById("latitude");
      let longitude = document.getElementById("longitude");
      latitudeVal = coords.results[0].geometry.lat.toFixed(2);
      longitudeVal = coords.results[0].geometry.lng.toFixed(2);

      let dir_lat = " N",
        dir_lon = " E";
      if (latitudeVal < 0) dir_lat = " S";
      if (longitudeVal < 0) dir_lon = " W";

      latitude.innerText = "Lat - " + Math.abs(latitudeVal) + dir_lat + " / ";
      longitude.innerText = "Lon - " + Math.abs(longitudeVal) + dir_lon;
      getWeatherReport(latitudeVal, longitudeVal);
    })
    .catch(function (error) {
      console.log(error);
    });
}
/*-----Get search location coordinates-----*/

/*-----forecast for next day-----*/
function forwardBtn() {
  // console.log("front");
  if (ele < 32 && ele > 0) {
    ele = z * 8;
    z = z + 1;
    getWeatherReport(latitudeVal, longitudeVal);
  }
  if (ele == 10) {
    y = y - 1;
    getWeatherReport1(latitudeVal, longitudeVal);
  }
}
/*-----forecast for next day-----*/

/*-----forecast for previous day-----*/
function backwardBtn() {
  // console.log("back");
  if (z > 0) {
    z = z - 1;
    ele = z * 8;
    getWeatherReport(latitudeVal, longitudeVal);
  } else {
    y = y + 1;
    getWeatherReport1(latitudeVal, longitudeVal);
  }
}
/*-----forecast for previous day-----*/

/*-----get weather data-----*/
function getWeatherReport1(lat, lng) {
  if (y == 4) {
    document.getElementById("myBtn1").disabled = true;
  }
  key = "984f6ed8f9e27c7714d16b05206acbce";
  baseUrl = "https://api.openweathermap.org/data/2.5/onecall/timemachine?";
  let dtdata = currdt - y * 86400;
  request1 =
    baseUrl + "lat=" + lat + "&lon=" + lng + "&dt=" + dtdata + "&appid=" + key;
  fetch(request1)
    .then((weather) => {
      return weather.json();
    })
    .then(showWeatherReport1);
}
function showWeatherReport1(weather) {
  // console.log(weather);
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

function getWeatherReport(lat, lng) {
  key = "984f6ed8f9e27c7714d16b05206acbce";
  baseUrl = "https://api.openweathermap.org/data/2.5/forecast?";
  let request = baseUrl + "lat=" + lat + "&lon=" + lng + "&appid=" + key;
  fetch(request)
    .then((weather) => weather.json())
    .then(showWeatherReport);
}

function showWeatherReport(weather) {
  // console.log(weather);
  let place = document.getElementById("place");
  place.innerText = `${weather.city.name},${weather.city.country}`;
  let temperature = document.getElementById("temp");
  temperature.innerHTML = `${Math.round(
    weather.list[ele].main.temp - 273.15
  )}&deg;C`;

  let minTemp = document.getElementById("min");
  minTemp.innerHTML = `${Math.floor(
    weather.list[ele].main.temp_min - 273.15
  )}&deg;C`;
  let maxTemp = document.getElementById("max");
  maxTemp.innerHTML = `${Math.ceil(
    weather.list[ele].main.temp_max - 273.15
  )}&deg;C`;

  let weatherType = document.getElementById("weather");
  weatherType.innerText = `${weather.list[ele].weather[0].main.toUpperCase()}`;

  setBackgroundImage(weather.list[ele].weather[0].main);

  let date = document.getElementById("date");
  let dx = weather.list[ele].dt;
  date.innerText = timeConverter(dx);

  let day = document.getElementById("day");
  day.innerText = daydisplay(dx);

  let wind = document.getElementById("wind");
  wind.innerHTML = `${(weather.list[0].wind.speed * 3.6).toFixed(2)} km/hr`;

  let preci = document.getElementById("preci");
  preci.innerText = `${weather.list[ele].main.humidity} %`;

  let icon = weather.list[ele].weather[0].icon;
  document.getElementById("icon").src = "icons/" + icon + ".png";
  currdt = weather.list[0].dt;
  document.querySelector(".cont2").style.display = "block";
  if (ele == 31) {
    document.getElementById("myBtn").disabled = true;
  }
  ele = 10;
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
      "url(/images/" + weatherName + ".jpg)";
  } else {
    document.body.style.backgroundImage = "url(/images/bg.jpg)";
  }
}
/*-----set Background Image-----*/
