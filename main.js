const weatherForm = document.querySelector("#weather_form");
weatherForm.addEventListener("submit", weatherFormOnSubmit);

const tempForm = document.querySelector("#temp_form");
tempForm.addEventListener("submit", tempFormOnSubmit);

/**
 * This function will execute when an event is detected on the 'weather_form'
 * It will first prevent the default action on the event
 * Then it will extract the 'user input' from said form
 * Combine it with the API end point and then send it to another function
 * @param {submitEvent} event
 */
function weatherFormOnSubmit(event) {
  event.preventDefault();

  const location = event.target.weather_submit;
  const BASE_URL = `https://wttr.in/${location.value}?format=j1`;

  fetchWeatherInformation(BASE_URL, location.value);

  event.target.weather_submit.value = "";
}

/**
 * This function will execute when an event is detected on the 'temp_form'
 * @param {submitEvent} event
 */
function tempFormOnSubmit(event) {
  event.preventDefault();

  const tempType = event.target.convert_temperature.value;
  const tempToConvert = document.querySelector("#temp-to-convert").value;

  handleTemperatureConvertionResponse(tempType, tempToConvert);
}

/**
 *  This function will take in two parameters
 * @param {string} url
 * @param {string} weatherLocation -
 */
function fetchWeatherInformation(url) {
  fetch(url)
    .then((response) => response.json())
    .then((response) => handleResponse(response, url))
    .catch((error) => displayError(error));
}

function handleResponse(response, url) {
  const weatherObj = createWeatherInfoObjectFromResponse(response, url);
  const location = weatherObj.user_input;

  hideElements();
  showElements();
  rearrangeGridDisplay();

  const mainWeatherContainer = document.querySelector("#weather_current");
  const mainWeather = createMainWeatherArticle(location, weatherObj);
  mainWeatherContainer.append(mainWeather);

  const upcomingWeatherContainer = document.querySelector("#weather_upcoming");
  const weatherArticles = createUpcomingWeatherArticles(weatherObj);
  upcomingWeatherContainer.append(...weatherArticles);

  const unorderedSearches = document.querySelector("#search_section ul");
  const searchListElement = createSearchLink(weatherObj);
  unorderedSearches.append(searchListElement);
}

function createWeatherInfoObjectFromResponse(response, url) {
  const { current_condition, nearest_area, weather } = response;
  const userLocation = extractLocation(url);
  const todaysChances = dayChanceOf(weather[0].hourly);
  const imgInfo = weatherIMG(todaysChances);

  const weatherObj = {
    user_input: userLocation,
    nearest_area: nearest_area[0].areaName[0].value,
    region: nearest_area[0].region[0].value,
    country: nearest_area[0].country[0].value,
    feelLikeTempF: current_condition[0].FeelsLikeF,
    today: {
      name: "Today",
      avgTemp: weather[0].avgtempF,
      maxTemp: weather[0].maxtempF,
      minTemp: weather[0].mintempF,
      chanceOfSunshine: todaysChances[0],
      chanceOfRain: todaysChances[1],
      chanceOfSnow: todaysChances[2],
      img_path_name: imgInfo[0],
      img_alt: imgInfo[1],
    },
    tomorrow: {
      name: "Tomorrow",
      avgTemp: weather[1].avgtempF,
      maxTemp: weather[1].maxtempF,
      minTemp: weather[1].mintempF,
    },
    dayAfterTomorrow: {
      name: "Day After Tomorrow",
      avgTemp: weather[2].avgtempF,
      maxTemp: weather[2].maxtempF,
      minTemp: weather[2].mintempF,
    },
    search_url: url,
  };

  return weatherObj;
}

function handleLocationAreaMismatch(location, areaName) {
  if (location !== areaName) {
    return "Nearest Area";
  }
  return "Area";
}

function dayChanceOf(hourlyChances) {
  const chanceOfSunshine = chanceOf("sunshine", hourlyChances);
  const chanceOfRain = chanceOf("rain", hourlyChances);
  const chanceOfSnow = chanceOf("snow", hourlyChances);

  return [chanceOfSunshine, chanceOfRain, chanceOfSnow];
}

function chanceOf(type, hourly) {
  let chances = 0;
  hourly.forEach((hour) => (chances += Number(hour[`chanceof${type}`])));
  chances = chances / hourly.length;
  return Math.round(chances);
}

function weatherIMG(chances) {
  const highestChance = Math.max(...chances);

  if (highestChance === chances[0]) {
    return ["summer", "sun"];
  } else if (highestChance === chances[1]) {
    return ["torrential-rain", "rain"];
  } else {
    return ["light-snow", "snow"];
  }
}

function hideElements() {
  const elementsToRemove = document.querySelectorAll(".remove");

  if (elementsToRemove) {
    elementsToRemove.forEach((rmvEl) => rmvEl.remove());
  }
}

function showElements() {
  const elementsToShow = document.querySelectorAll(".hidden");

  if (elementsToShow) {
    elementsToShow.forEach((showEl) => showEl.classList.remove("hidden"));
  }
}

function rearrangeGridDisplay() {
  document.querySelector("#main_content_container").classList.remove("temp_widget_off");
  document.querySelector("#main_content_container").classList.add("temp_widget_on");
}

function createIMG(pathText, altText) {
  const img = document.createElement("img");
  img.setAttribute("src", `./assets/icons8-${pathText}.gif`);
  img.setAttribute("alt", altText);
  return img;
}

function createWeatherParagrah(type, content) {
  const paragraph = document.createElement("p");
  const strong = document.createElement("strong");

  if (type === "Currently") {
    content = `Feels Like ${content}°F`;
  }

  strong.textContent = `${type}: `;
  paragraph.append(strong, content);

  return paragraph;
}

function createMainWeatherArticle(location, weather) {
  const areaType = handleLocationAreaMismatch(location, weather.nearest_area);

  const heading2 = document.createElement("h2");
  heading2.textContent = location;

  const areaP = createWeatherParagrah(areaType, weather.nearest_area);

  const weatherIMG = createIMG(weather.today.img_path_name, weather.today.img_alt);

  const regionName = weather.region;
  const regionP = createWeatherParagrah("Region", regionName);

  const countryName = weather.country;
  const countryP = createWeatherParagrah("Country", countryName);

  const temp = weather.feelLikeTempF;
  const currentlyP = createWeatherParagrah("Currently", temp);

  const chanceOfSunshine = weather.today.chanceOfSunshine;
  const sunshineP = createWeatherParagrah("Chance of Sunshine", chanceOfSunshine);

  const chanceOfRain = weather.today.chanceOfRain;
  const rainP = createWeatherParagrah("Chance of Rain", chanceOfRain);

  const chanceOfSnow = weather.today.chanceOfSnow;
  const snowP = createWeatherParagrah("Chance of Snow", chanceOfSnow);

  const weatherContainer = document.createElement("div");
  weatherContainer.classList.add("remove", "weather_article");
  weatherContainer.append(heading2, areaP, weatherIMG, regionP, countryP, currentlyP, sunshineP, rainP, snowP);

  return weatherContainer;
}

function createArticle(day) {
  const h3 = document.createElement("h3");
  h3.textContent = day.name;

  const avgP = createWeatherParagrah("Average Temperature", `${day.avgTemp}°F`);
  const maxP = createWeatherParagrah("Max Temperature", `${day.maxTemp}°F`);
  const minP = createWeatherParagrah("Minimum Temperature", `${day.minTemp}°F`);

  const upComingWeatherArticle = document.createElement("article");
  upComingWeatherArticle.classList.add("remove", "weather_article", "upcoming_weather_article");
  upComingWeatherArticle.append(h3, avgP, maxP, minP);

  return upComingWeatherArticle;
}

function createUpcomingWeatherArticles(weather) {
  const today = createArticle(weather.today);
  const tomorrow = createArticle(weather.tomorrow);
  const dayAfterTomorrow = createArticle(weather.dayAfterTomorrow);

  return [today, tomorrow, dayAfterTomorrow];
}

function tempConvertion(type, temp) {
  const degreeDifference = 32;
  const fahrenheit2celcius = 5 / 9;
  const celcius2fahrenheit = 9 / 5;

  if (type === "c") {
    return Math.round(temp * fahrenheit2celcius + degreeDifference);
  } else if (type === "f") {
    return Math.round((temp - degreeDifference) * celcius2fahrenheit);
  }
}

function createSearchLink(weather) {
  const searchLink = document.createElement("a");
  searchLink.href = weather.search_url;
  searchLink.textContent = weather.user_input;

  searchLink.addEventListener("click", searchLinkClickEvent);

  const feelsLikeTemp = `${weather.feelLikeTempF}°F`;

  const searchListElement = document.createElement("li");
  searchListElement.append(searchLink, " - ", feelsLikeTemp);

  return searchListElement;
}

function extractLocation(url) {
  const inputLocation = url.split(/[/?]/)[3];
  return inputLocation;
}

function searchLinkClickEvent(event) {
  event.preventDefault();
  event.target.parentNode.remove();
  fetchWeatherInformation(event.target.href);
}

function handleTemperatureConvertionResponse(type, temp) {
  document.querySelector("aside h4").textContent = "";
  const temp2Num = Number(temp);
  const tempConverted = tempConvertion(type, temp2Num);
  const tempConvertedContainer = document.querySelector("aside h4");
  tempConvertedContainer.append(tempConverted);
}

function displayError(error) {
  console.log(error);
}
