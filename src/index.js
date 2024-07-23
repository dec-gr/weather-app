import './style.css';
import sunnyDayIcon from './images/sunnyDay.svg';
import cloudyDayIcon from './images/cloudyDay.svg';
import rainyDayIcon from './images/rainyDay.svg';
import rainWithSunIcon from './images/rainWithSun.svg';

const API_KEY = '';
const location = 'Dublin';
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
  console.log(weeklyObj);
  return weeklyObj;
};

getForecast(location, unitGroup, API_KEY).then((result) => {
  result.forEach((day) => {
    console.log(day);
    addDay(day.day, day.max, day.min, day.precip);
  });
});

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

const docBody = document.querySelector('.weeklyForecastCont');

const addDay = (day, max, min, precip) => {
  const newDayObj = createDay(day, max, min, precip);
  docBody.appendChild(newDayObj);
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
