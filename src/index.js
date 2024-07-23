import './style.css';
import sunnyDayIcon from './images/sunnyDayAnimated.svg';
import cloudyDayIcon from './images/cloudyDayAnimated.svg';
import rainyDayIcon from './images/rainyDayAnimated.svg';
import rainWithSunIcon from './images/rainWithSunAnimated.svg';

const API_KEY = '';
const location = 'Dublin';
let unitGroup = 'metric';

const getDayFromDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-UK', { weekday: 'long' });
};

const fetchForecast = async (url) => {
  try {
    const weatherResponse = await fetch(url, { mode: 'cors' });
    console.log(weatherResponse);
    const weatherJson = await weatherResponse.json();
    const weeklyObj = weatherJson.days.map((x) => ({
      day: getDayFromDate(x.datetime),
      max: x.tempmax,
      min: x.tempmin,
      precip: x.precipprob,
      cloud: x.cloudcover,
    }));
    return weeklyObj;
  } catch (err) {
    console.log(err);
    return 'no data';
  }
};

const createUrl = (loc, unit, api) =>
  `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=${unit}&elements=datetime%2Ctempmax%2Ctempmin%2Ctemp%2Cprecipprob%2Ccloudcover&include=hours%2Cdays&key=${api}&contentType=json`;

const getForecastData = async (loc, unit, api) => {
  const url = createUrl(loc, unit, api);
  const forecastObj = await fetchForecast(url);
  // const todaysForecast = weeklyObj[0];
  // const next10days = weeklyObj.slice(1, 11);
  // console.log(todaysForecast);
  // console.log(next10days);
  // console.log(weeklyObj.slice(1));
  // console.log(weeklyObj[0;])
  return forecastObj;
};

const getForecasts = async (loc, unit, api) => {
  const forecastObj = await getForecastData(loc, unit, api);
  if (forecastObj === 'no data') {
    return;
  }
  const todaysForecast = forecastObj[0];
  console.log(todaysForecast);
  const next10days = forecastObj.slice(1, 11);
  const todaysForecastDiv = document.querySelector('.todayCont');
  if (todaysForecastDiv) {
    todaysForecastDiv.remove();
  }
  addTodaysForecast(
    todaysForecast.day,
    todaysForecast.max,
    todaysForecast.min,
    todaysForecast.precip,
    todaysForecast.cloud
  );
  const futureForecastDivs = document.querySelectorAll('.dayCont');
  if (futureForecastDivs) {
    futureForecastDivs.forEach((day) => day.remove());
  }
  // (day, max, min, precip, cloud)
  next10days.forEach((day) => addDay(day.day, day.max, day.min, day.precip));
};

getForecasts(location, unitGroup, API_KEY);

// getForecast(location, unitGroup, API_KEY).then((result) => {
//   result.forEach((day) => {
//     console.log(day);
//     addDay(day.day, day.max, day.min, day.precip);
//   });
// });

//sunnyDayIcon.classList.toggle('hide');

const setIcon = (dayCont, iconClass) => {
  console.log(dayCont);
  const icons = dayCont.querySelectorAll('svg');
  const activeIcon = dayCont.querySelector(`.${iconClass}`);
  icons.forEach((icon) => icon.classList.add('hide'));
  activeIcon.classList.remove('hide');
};

const dayCont = document.querySelector('.dayCont');

setIcon(dayCont, 'rainyDay');

// const svg = document.createElement('img');
// svg.src = Icon;
// svg.classList.add('green');

// dayCont.appendChild(svg);

const createDay = (day, max, min, precip) => {
  console.log(precip);
  const dayCont = document.createElement('div');
  dayCont.classList.add('dayCont');

  const dayTitle = document.createElement('div');
  dayTitle.classList.add('dayTitle');
  dayTitle.textContent = day;

  const dayMax = document.createElement('div');
  dayMax.classList.add('dayMax');
  dayMax.textContent = max;

  const dayMin = document.createElement('div');
  dayMin.classList.add('dayMin');
  dayMin.textContent = min;

  const iconCont = document.createElement('div');
  iconCont.classList.add('iconCont');

  const iconSVG = document.createElement('img');

  const iconName = getIconName(max, precip);
  const icon = getIcon(iconName);
  iconSVG.src = icon;
  iconSVG.classList.add('weatherIcon');

  dayCont.appendChild(dayTitle);
  dayCont.appendChild(dayMax);
  dayCont.appendChild(dayMin);
  iconCont.appendChild(iconSVG);

  dayCont.appendChild(iconCont);

  return dayCont;
};

const todaysForecastCont = document.querySelector('.todaysForecastCont');

const createTodaysForecast = (day, max, min, precip, cloud) => {
  const todayCont = document.createElement('div');
  todayCont.classList.add('todayCont');

  const todayTitle = document.createElement('div');
  todayTitle.classList.add('todayTitle');
  todayTitle.textContent = day;

  const todayMax = document.createElement('div');
  todayMax.classList.add('todayMax');
  todayMax.textContent = max;

  const todayMin = document.createElement('div');
  todayMin.classList.add('todayMin');
  todayMin.textContent = min;

  const todayPrecip = document.createElement('div');
  todayPrecip.classList.add('todayPrecip');
  todayPrecip.textContent = precip;

  const todayCloud = document.createElement('div');
  todayCloud.classList.add('todayCloud');
  todayCloud.textContent = cloud;

  const iconCont = document.createElement('div');
  iconCont.classList.add('iconCont', 'todayIcon');

  const iconSVG = document.createElement('img');

  const iconName = getIconName(max, precip);
  const icon = getIcon(iconName);
  iconSVG.src = icon;
  iconSVG.classList.add('weatherIcon');

  todayCont.appendChild(todayTitle);
  todayCont.appendChild(todayMax);
  todayCont.appendChild(todayMin);

  todayCont.appendChild(todayPrecip);
  todayCont.appendChild(todayCloud);

  iconCont.appendChild(iconSVG);
  todayCont.appendChild(iconCont);
  console.log(todayCont);

  return todayCont;
};

const addTodaysForecast = (day, max, min, precip, cloud) => {
  const todayCont = createTodaysForecast(day, max, min, precip, cloud);

  console.log(todaysForecastCont);
  todaysForecastCont.appendChild(todayCont);
};

const weeklyForecastCont = document.querySelector('.weeklyForecastCont');

const addDay = (day, max, min, precip) => {
  const newDayObj = createDay(day, max, min, precip);
  weeklyForecastCont.appendChild(newDayObj);
};

const getIconName = (max, precipProb) => {
  console.log(precipProb);
  if (precipProb >= 40) {
    if (max >= 20) {
      return 'rainWithSun';
    }
    return 'rainyDay';
  }
  if (max >= 20) {
    return 'sunnyDay';
  }
  return 'cloudyDay';
};

const getIcon = (iconName) => {
  switch (iconName) {
    case 'sunnyDay':
      return sunnyDayIcon;
    case 'rainyDay':
      return rainyDayIcon;
    case 'rainWithSun':
      return rainWithSunIcon;
    case 'cloudyDay':
      return cloudyDayIcon;
    default:
      return cloudyDayIcon;
  }
};

const searchBox = document.querySelector('#locationSearch');

const searchBtn = document.querySelector('#submit');

searchBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const searchTerm = searchBox.value === '' ? null : searchBox.value;
  if (!(searchBox.value === '' || searchBox.value === null)) {
    getForecasts(searchTerm, unitGroup, API_KEY);
  }
});

// import sunnyDayIcon from './images/sunnyDay.svg';
// import cloudyDayIcon from './images/cloudyDay.svg';
// import rainyDayIcon from './images/rainyDay.svg';
// import rainWithSunIcon
//docBody.appendChild(createDay('Thursday', '22', '15'));
// const newImg = document.createElement('img');
// newImg.src = 'src/images/rainWithSun.svg';
// newImg.classList.add('weatherIcon');
// newImg.setAttribute('style', inline);

// const newImg = document.createElementNS('src/images/rainWithSun.svg', 'svg');
// newImg.classList.add('weatherIcon');

// // Create an SVG element
// var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

// // Set attributes (e.g., width and height)
// svg.setAttribute('width', '200px');
// svg.setAttribute('height', '200px');

// svg.setAttribute('src', 'src/images/rainWithSun.svg');

// // Add the SVG element to the DOM
// // document.body.appendChild(svg);

// day.appendChild(svg);
// const makeItRain = () => {
//   img.src = 'src/images/rainWithSun.svg';
// };

// makeItRain();
