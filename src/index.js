import './style.css';

const API_KEY = '8MJTB2Z52UL5NMJGFDMWJFHZF';
const location = 'London';
const unitGroup = 'metric';

const getDayFromDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-UK', { weekday: 'long' });
};

const fetchForecast = async (url) => {
  const weatherResponse = await fetch(url, { mode: 'cors' });
  const weatherJson = await weatherResponse.json();
  const weeklyObj = weatherJson.days.map((x) => ({
    day: getDayFromDate(x.datetime),
    max: x.tempmax,
    min: x.tempmin,
    precip: x.precipprob,
    cloud: x.cloudcover,
  }));
  return weeklyObj;
};

const createUrl = (loc, unit, api) =>
  `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=${unit}&elements=datetime%2Ctempmax%2Ctempmin%2Ctemp%2Cprecipprob%2Ccloudcover&include=hours%2Cdays&key=${api}&contentType=json`;

const getForecast = async (loc, unit, api) => {
  const url = createUrl(loc, unit, api);
  const weeklyObj = await fetchForecast(url);
  return weeklyObj;
};

getForecast(location, unitGroup, API_KEY).then((result) => console.log(result));
