const weatherForm = document.querySelector("#weather_form");
weatherForm.addEventListener("submit", weatherFormOnSubmit);

const tempForm = document.querySelector("#temp_form");
tempForm.addEventListener("submit", tempFormOnSubmit);

function weatherFormOnSubmit(event) {
  event.preventDefault();
  const location = event.target.weather_submit;
  const BASE_URL = `https://wttr.in/${location.value}?format=j1`;
  fetchWeatherInformation(BASE_URL, location.value);
  event.target.weather_submit.value = "";
}

function tempFormOnSubmit(event) {
  event.preventDefault();
  document.querySelector("aside h4").textContent = "";
  const tempToConvert = document.querySelector("#temp-to-convert").value;
  const tempType = event.target.convert_temperature.value;
  const tempConverted = temperatureConvertion(tempType, tempToConvert);
  const tempConvertedContainer = document.querySelector("aside h4");
  tempConvertedContainer.append(tempConverted);
}
