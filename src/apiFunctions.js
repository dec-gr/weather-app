import { getDayFromDate } from './utils';

// API_Functions
// Takes Location, UnitGroup and API_KEY. Returns Url of API request
const createUrl = (loc, unit, api) =>
  `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=${unit}&elements=datetime%2Cname%2Caddress%2CresolvedAddress%2Cdatetime%2Ctempmax%2Ctempmin%2Ctemp%2Cprecipprob%2Ccloudcover&include=hours%2Cdays&key=${api}&contentType=json`;

// Takes url of API request, calls the API and returns the JSON of the forecast and the resolved address
const fetchForecast = async (url) => {
  try {
    const weatherResponse = await fetch(url, { mode: 'cors' });
    if (weatherResponse.status === 400) {
      alert('Enter a real location');
    } else if (weatherResponse.status === 401) {
      alert('Error connecting to server');
    }

    const weatherJson = await weatherResponse.json();
    const { resolvedAddress } = weatherJson;
    const weeklyObj = weatherJson.days.map((x) => ({
      day: getDayFromDate(x.datetime),
      temp: x.temp,
      max: x.tempmax,
      min: x.tempmin,
      precip: x.precipprob,
      cloud: x.cloudcover,
    }));
    return [weeklyObj, resolvedAddress];
  } catch (err) {
    console.log(err);
    return ['no data', 'no address'];
  }
};

// More logic Based
// Calls createUrl and FetchForecast, returns the forecast object and resolved address
const getForecastData = async (loc, unit, api) => {
  const url = createUrl(loc, unit, api);
  try {
    const forecastObj = await fetchForecast(url);
    return forecastObj;
  } catch (err) {
    return ['no data', 'no address'];
  }
};

export { getForecastData };
