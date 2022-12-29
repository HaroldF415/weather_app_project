const weatherForm = document.querySelector("#weather_form");

// ! Joshua Nelson
// event can be called seperately and be its own function
weatherForm.addEventListener("submit", weatherFormOnSubmit);

const tempForm = document.querySelector("#temp_form");

tempForm.addEventListener("submit", (onSubmitEvent) => {
  onSubmitEvent.preventDefault();
  document.querySelector("aside h4").textContent = "";

  const tempToConvert = document.querySelector("#temp-to-convert").value;
  const tempType = onSubmitEvent.target.convert_temperature.value;
  const tempConverted = temperatureConvertion(tempType, tempToConvert);

  const tempConvertedContainer = document.querySelector("aside h4");

  tempConvertedContainer.append(tempConverted);
});

function weatherFormOnSubmit(event) {
  // prevent default behaviour
  event.preventDefault();

  // extract input from user
  const location = event.target.weather_submit;

  // construct API endpoint
  const BASE_URL = `https://wttr.in/${location.value}?format=j1`;

  // call on function to fetch data and create an adequate response
  fetchWeatherInformation(BASE_URL, location.value);

  // reset input field
  event.target.weather_submit.value = "";
}

// ! research modularity
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

function fetchWeatherInformation(BASE_URL, location) {
  fetch(BASE_URL)
    .then((response) => {
      if (!response.ok) {
        console.log("The location you selected does not exist.");
      } else {
        // At this level it is still
        // Prototype: Promise
        // PromiseState: "fullfilled"
        // PromiseResult: Object json()
        // const resp = response.json();
        //console.log(resp);
        return response.json();
      }
    })
    .then(({ current_condition, nearest_area, request, weather }) => {
      // hide elements
      hideElements();

      // show elements
      showElements();

      // rearrange grid display
      rearrangeGridDisplay();

      // creating && updating
      const mainWeatherContainer = document.querySelector("#weather_current");
      const mainWeather = createMainWeatherArticle(location, current_condition, nearest_area, weather);
      mainWeatherContainer.append(mainWeather);

      const upComingWeather = document.querySelector("#weather_upcoming");

      // creating
      const tdyWeatherArticle = createUpComingWeatherArticle(0, weather);
      const tmrwWeatherArticle = createUpComingWeatherArticle(1, weather);
      const dWeatherArticle = createUpComingWeatherArticle(2, weather);

      // appending
      upComingWeather.append(tdyWeatherArticle, tmrwWeatherArticle, dWeatherArticle);

      // creating && updating
      const unorderedSearches = document.querySelector("#search_section ul");
      const searchListLink = createSearchLinks(BASE_URL, current_condition, nearest_area);

      // appending
      unorderedSearches.append(searchListLink);
    })
    .catch(displayError);
}

function createMainWeatherArticle(location, current_condition, nearest_area, weather) {
  // creating
  const weatherContainer = document.createElement("div");
  weatherContainer.classList.add("remove", "weather_article");

  const areaName = location;
  const nearest_area_name = nearest_area[0].areaName[0].value;

  // Heading
  const heading2 = document.createElement("h2");
  heading2.textContent = areaName;

  // Area || Nearest Area v.1
  const typeOfArea = handleSubmitInputAndAreaNameMismatch(location, nearest_area_name);

  // Area || Nearest Area v.2
  const areaP = createWeatherParagrah(typeOfArea, nearest_area_name);

  // Region
  const regionName = nearest_area[0].region[0].value;
  const regionP = createWeatherParagrah("Region", regionName);

  // Country
  const countryName = nearest_area[0].country[0].value;
  const countryP = createWeatherParagrah("Country", countryName);

  // Currently
  const temp = current_condition[0].FeelsLikeF;
  const currentlyP = createWeatherParagrah("Currently", temp);

  // Chance of Sunshine
  const chanceOfSunshine = chanceOf("sunshine", weather);
  const sunshineP = createWeatherParagrah("Chance of Sunshine", chanceOfSunshine);

  // Chance of Rain
  const chanceOfRain = chanceOf("rain", weather);
  const rainP = createWeatherParagrah("Chance of Rain", chanceOfRain);

  // Chance of Snow
  const chanceOfSnow = chanceOf("snow", weather);
  const snowP = createWeatherParagrah("Chance of Snow", chanceOfSnow);

  // Display IMG
  const weatherIMG = displayChanceOfIMG(chanceOfSunshine, chanceOfRain, chanceOfSnow);

  // appeding
  weatherContainer.append(heading2, areaP, weatherIMG, regionP, countryP, currentlyP, sunshineP, rainP, snowP);

  return weatherContainer;
}

function createUpComingWeatherArticle(index, weather) {
  let celFah = "°F";

  // heading
  const headingH3 = createUpComingWeatherHeading(index);

  // article
  const upComingWeatherArticle = document.createElement("article");
  upComingWeatherArticle.classList.add("remove", "weather_article", "upcoming_weather_article");

  // averageTemp
  const avgTemp = weather[index].avgtempF + celFah;
  const avgP = createWeatherParagrah("Average Temperature", avgTemp);

  // maxTemp
  const maxTemp = weather[index].maxtempF + celFah;
  const maxP = createWeatherParagrah("Max Temperature", maxTemp);

  // minTemp
  const minTemp = weather[index].mintempF + celFah;
  const minP = createWeatherParagrah("Minimum Temperature", minTemp);

  // appending elements
  upComingWeatherArticle.append(headingH3, avgP, maxP, minP);

  return upComingWeatherArticle;
}

function createUpComingWeatherHeading(dayType) {
  const heading = document.createElement("h3");

  if (dayType === 1) {
    heading.textContent = "Tomorrow";
  } else if (dayType === 2) {
    heading.textContent = "Day After Tomorrow";
  } else {
    heading.textContent = "Today";
  }

  return heading;
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

/**
 * This function takes in the BASE_URL, current_condition, and nearest_area and creates a list element with a link to the BASE_URL
 * @param {string} BASE_URL
 * @param {array} current_condition
 * @param {array} nearest_area
 * @returns listElement
 */
function createSearchLinks(BASE_URL, current_condition, nearest_area) {
  const searchListElement = document.createElement("li");

  const searchLink = document.createElement("a");
  searchLink.href = BASE_URL;
  searchLink.textContent = nearest_area[0].areaName[0].value;

  const feelsLikeTemp = current_condition[0].FeelsLikeF + "°F";

  searchLink.addEventListener("click", (clickEvent) => {
    clickEvent.preventDefault();
    clickEvent.target.parentNode.remove();
    fetchWeatherInformation(BASE_URL);
  });

  searchListElement.append(searchLink, " - ", feelsLikeTemp);

  return searchListElement;
}

/**
 * This function takes in the type of weather and the weather array and returns the average chance of the type of weather
 * @param {string} type - sunshine, rain, snow
 * @param {array} weather - is an array of objects one of which include the hourly weather. An array of 8 values
 * @returns number - the average chance of the type of weather
 */
function chanceOf(type, weather) {
  let chanceOfNum = 0;
  const chanceOf = `chanceof${type}`;
  weather[0].hourly.forEach((hour) => (chanceOfNum += Number(hour[chanceOf])));

  chanceOfNum = chanceOfNum / weather[0].hourly.length;

  return chanceOfNum;
}

function displayChanceOfIMG(chanceOfSunshine, chanceOfRain, chanceOfSnow) {
  const tempArray = [chanceOfSunshine, chanceOfRain, chanceOfSnow];
  let highestChanceIndex = 0;

  let highestChance = tempArray.reduce((highest, current, index) => {
    if (current > highest) {
      highest = current;
      highestChanceIndex = index;
    }
    return highest;
  }, 0);

  if (highestChanceIndex === 0) {
    return createIMG("summer", "sun");
  } else if (highestChanceIndex === 1) {
    return createIMG("torrential-rain", "rain");
  } else if (highestChanceIndex === 2) {
    return createIMG("light-snow", "snow");
  }
}

function createIMG(pathText, altText) {
  const img = document.createElement("img");
  img.setAttribute("src", `./assets/icons8-${pathText}.gif`);
  img.setAttribute("alt", altText);
  return img;
}

function handleSubmitInputAndAreaNameMismatch(locationInput, nearest_area_name) {
  if (locationInput !== nearest_area_name) {
    return "Nearest Area";
  }
  return "Area";
}

function temperatureConvertion(type, temp) {
  temp = Number(temp);

  if (type === "c") {
    return (((temp - 32) * 5) / 9).toFixed(2);
  } else if (type === "f") {
    return (temp * 9) / 5 + 32;
  }
}

function displayError(error) {
  console.log(error);
}
