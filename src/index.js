// Imports

import './style.css';

import { getDayFromDat } from './utils.js';
import { getForecastData } from './apiFunctions.js';
import {
  updateTodaysForecast,
  updatePrecipForecast,
  updateWeeklyForecast,
} from './domFunctions.js';

// Global Variables
const API_KEY = '8MJTB2Z52UL5NMJGFDMWJFHZF';
let location = 'Dublin';
let unitGroup = 'metric';
let unitSymbol = '°C';
let sunnyDayThreshold = 20;

// Utils

// Logic Based (Index.js?)
// Gets the forecast data via the 3 functions above. Then clears the Dom and calls the dom functions
const updateForecasts = async (loc, unit, api) => {
  const [forecastObj, resolvedAddress] = await getForecastData(loc, unit, api);
  if (forecastObj === 'no data') {
    return;
  }
  location = resolvedAddress;
  const todaysForecast = forecastObj[0];
  const next10days = forecastObj.slice(1, 8);

  updateTodaysForecast(
    todaysForecast.day,
    todaysForecast.max,
    todaysForecast.precip,
    todaysForecast.temp,
    resolvedAddress,
    sunnyDayThreshold,
    unitSymbol
  );

  updatePrecipForecast(todaysForecast.precip);

  updateWeeklyForecast(next10days, unitSymbol);
};

const initialiseDroplet = () => {
  const searchBox = document.querySelector('#locationSearch');

  const searchBtn = document.querySelector('#submit');

  searchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const searchTerm = searchBox.value === '' ? null : searchBox.value;
    if (!(searchBox.value === '' || searchBox.value === null)) {
      updateForecasts(searchTerm, unitGroup, API_KEY);
    }
  });

  const unitBtns = document.querySelectorAll('.unitBtn');

  unitBtns.forEach((btn) => {
    btn.addEventListener('change', () => {
      unitGroup = btn.value;
      unitSymbol = unitGroup === 'metric' ? '°C' : '°F';
      sunnyDayThreshold = unitGroup === 'metric' ? 20 : 68;
      updateForecasts(location, unitGroup, API_KEY);
    });
  });
  updateForecasts(location, unitGroup, API_KEY);
};

initialiseDroplet();
