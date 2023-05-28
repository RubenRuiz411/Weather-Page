var weatherKey = "a560e43cae463b6f70d60b91f8248d5b";
var city = "Los Angeles";
var todaysDate = dayjs().format("dddd, MMMM, D YYYY");
var dateandTime = dayjs().format("hh:m A");
var actualHistoryEl = $(".actualSearchhistory");
var searchHistory = [];
var domFiveDayForecast = $(".fivedayForecast");

$(".btn").on("click", function (event) {
  event.preventDefault();
  city = $(this).parent(".cityButton").siblings(".textValue").val();
  if (city === "") {
    return;
  }
  searchHistory.push(city);
  localStorage.setItem("city", JSON.stringify(searchHistory));
  domFiveDayForecast.empty();
  findHistory();
  todaysWeather();
});

function findHistory() {
  actualHistoryEl.empty();
  for (let i = 0; i < searchHistory.length; i++) {
    var domRow = $("<row>");
    var domButton = $("<button>").text(`${searchHistory[i]}`);
    domRow.addClass("row domSearchHistory");
    domButton.addClass("btn btn-outline-secondary domHistory");
    domButton.attr("type", "button");
    actualHistoryEl.prepend(domRow);
    domRow.append(domButton);
  }
  if (!city) {
    return;
  }
  $(".domHistory").on("click", function (event) {
    event.preventDefault();
    city = $(this).text();
    domFiveDayForecast.empty();
    todaysWeather();
  });
}

var weatherCardcurrent = $(".weatherCard");

function todaysWeather() {
  var URLforToday = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}&units=imperial`;
  $(weatherCardcurrent).empty();
  $.ajax({
    url: URLforToday,
    method: "GET",
  }).then(function (response) {
    $(".weatherCardCityName").text(response.name);
    $(".weatherCardcurrentdate").text(todaysDate);
    $(".icons").attr(
      "src",
      `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
    );
    var pEl = $("<p>").text(`Temperature: ${response.main.temp} °F`);
    weatherCardcurrent.append(pEl);
    var pElTemp = $("<p>").text(`Feels Like: ${response.main.feels_like} °F`);
    weatherCardcurrent.append(pElTemp);
    var pElHumid = $("<p>").text(`Humidity: ${response.main.humidity} %`);
    weatherCardcurrent.append(pElHumid);
    var pElWind = $("<p>").text(`Wind Speed: ${response.wind.speed} MPH`);
    weatherCardcurrent.append(pElWind);

    fivedayForecast();
  });

  function fivedayForecast() {
    URLfiveday = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherKey}&units=imperial`;
    $.ajax({
      url: URLfiveday,
      method: "GET",
    }).then(function (response) {
      var fivedayForecastArray = response.list;
      var weatherforday = [];
      $.each(fivedayForecastArray, function (index, value) {
        testObj = {
          date: value.dt_txt.split(" ")[0],
          time: value.dt_txt.split(" ")[1],
          temp: value.main.temp,
          feels_like: value.main.feels_like,
          icon: value.weather[0].icon,
          humidity: value.main.humidity,
        };
        if (value.dt_txt.split(" ")[1] === "12:00:00") {
          weatherforday.push(testObj);
        }
      });
      for (let i = 0; i < weatherforday.length; i++) {
        console.log(weatherforday[i]);
        var divCard = $("<div>");
        divCard.attr("class", "bg-primary text-white card");
        divCard.attr("style", "max-width: 200px");
        var divHeader = $("<div>");
        divHeader.attr("class", "card-header");

        divCard.append(divHeader);
        var divIcon = $("<img>");
        var divBody = $("<div>");
        divIcon.attr("class", "icons");
        divIcon.attr(
          "src",
          `https://openweathermap.org/img/wn/${weatherforday[i].icon}@2x.png`
        );
        divBody.append(divIcon);
        var tempEl = $("<p>").text(`Temperature: ${weatherforday[i].temp} °F`);
        divBody.append(tempEl);
        var feelEl = $("<p>").text(
          `Feels Like: ${weatherforday[i].feels_like} °F`
        );
        divBody.append(feelEl);
        var humidEl = $("<p>").text(`Humidity: ${weatherforday[i].humidity} %`);
        divBody.append(humidEl);
        divCard.append(divBody);
        domFiveDayForecast.append(divCard);
      }
    });
  }
}

function initLoad() {
  var cityHistory = JSON.parse(localStorage.getItem("city"));

  if (cityHistory !== null) {
    searchHistory = cityHistory;
  }
  findHistory();
  todaysWeather();
}

initLoad();
