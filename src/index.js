import './style.css';
import sunnyDayIcon from './images/sunnyDayAnimated.svg';
import cloudyDayIcon from './images/cloudyDayAnimated.svg';
import rainyDayIcon from './images/rainyDayAnimated.svg';
import rainWithSunIcon from './images/rainWithSunAnimated.svg';

import umbrellaSunIcon from './images/umbrella-sunny.svg';
import umbrellaRainIcon from './images/umbrella-rainy.svg';

const API_KEY = '';
let location = 'Dublin';
let unitGroup = 'metric';
let unitSymbol = '°C';
let sunnyDayThreshold = 20;

const getDayFromDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-UK', { weekday: 'long' });
};

const fetchForecast = async (url) => {
  try {
    const weatherResponse = await fetch(url, { mode: 'cors' });
    console.log(weatherResponse);
    console.log('Break1');
    console.log(weatherResponse.status);

    if (weatherResponse.status === 400) {
      alert('Enter a real location');
    } else if (weatherResponse.status === 401) {
      alert('Error connecting to server');
    }

    const weatherJson = await weatherResponse.json();
    console.log('Break2');
    console.log(weatherJson);
    const resolvedAddress = weatherJson.resolvedAddress;
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
    console.log('Fetch Error');
    console.log(err);
    return ['no data', 'no address'];
  }
};

const createUrl = (loc, unit, api) =>
  `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=${unit}&elements=datetime%2Cname%2Caddress%2CresolvedAddress%2Cdatetime%2Ctempmax%2Ctempmin%2Ctemp%2Cprecipprob%2Ccloudcover&include=hours%2Cdays&key=${api}&contentType=json`;

const getForecastData = async (loc, unit, api) => {
  const url = createUrl(loc, unit, api);
  try {
    const forecastObj = await fetchForecast(url);
    console.log('try f');
    console.log(forecastObj);
    return forecastObj;
  } catch (err) {
    console.log('Get Error');
    console.log(err);
    return 'no data';
  }
  // const todaysForecast = weeklyObj[0];
  // const next10days = weeklyObj.slice(1, 11);
  // console.log(todaysForecast);
  // console.log(next10days);
  // console.log(weeklyObj.slice(1));
  // console.log(weeklyObj[0;])
};

const getForecasts = async (loc, unit, api) => {
  const [forecastObj, resolvedAddress] = await getForecastData(loc, unit, api);
  console.log('forecastObj:');
  console.log(forecastObj);
  if (forecastObj === 'no data') {
    console.log('BEep boop');
    return;
  }
  location = resolvedAddress;
  const todaysForecast = forecastObj[0];
  //console.log(todaysForecast);
  const next10days = forecastObj.slice(1, 8);
  const todaysForecastDiv = document.querySelector('.todayCont');
  if (todaysForecastDiv) {
    todaysForecastDiv.remove();
  }
  addTodaysForecast(
    todaysForecast.day,
    todaysForecast.max,
    todaysForecast.precip,
    todaysForecast.temp,
    resolvedAddress
  );
  const precipCont = document.querySelector('.precipCont');
  if (precipCont) {
    precipCont.remove();
  }

  addPrecipForecast(todaysForecast.precip);

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
  //console.log(dayCont);
  const icons = dayCont.querySelectorAll('svg');
  const activeIcon = dayCont.querySelector(`.${iconClass}`);
  icons.forEach((icon) => icon.classList.add('hide'));
  activeIcon.classList.remove('hide');
};

//const dayCont = document.querySelector('.dayCont');

//setIcon(dayCont, 'rainyDay');

// const svg = document.createElement('img');
// svg.src = Icon;
// svg.classList.add('green');

// dayCont.appendChild(svg);

const createPrecipForecast = (precip) => {
  const precipCont = document.createElement('div');
  precipCont.classList.add('precipCont');

  const precipTitle = document.createElement('div');
  precipTitle.classList.add('precipTitle');
  precipTitle.textContent = 'Chance of Rain:';

  const precipPercent = document.createElement('div');
  precipPercent.classList.add('precipPercent');
  precipPercent.textContent = precip + '%';

  const precipIconCont = document.createElement('div');
  precipIconCont.classList.add('precipIconCont');

  const precipIcon = document.createElement('img');

  precipIcon.src = precip >= 40 ? umbrellaRainIcon : umbrellaSunIcon;
  precipIcon.classList.add('precipIcon');

  precipCont.appendChild(precipTitle);
  precipIconCont.appendChild(precipIcon);
  precipCont.appendChild(precipIconCont);
  precipCont.appendChild(precipPercent);

  return precipCont;
};

const rightSideCont = document.querySelector('.rightSideCont');

const addPrecipForecast = (precip) => {
  const precipCont = createPrecipForecast(precip);
  rightSideCont.appendChild(precipCont);
  //console.log(precipCont);
};

const createDay = (day, max, min, precip) => {
  //console.log(precip);
  const dayCont = document.createElement('div');
  dayCont.classList.add('dayCont');

  const dayTitle = document.createElement('div');
  dayTitle.classList.add('dayTitle');
  dayTitle.textContent = day;

  const dayMax = document.createElement('div');
  dayMax.classList.add('dayMax');
  dayMax.textContent = max + unitSymbol;

  const dayMin = document.createElement('div');
  dayMin.classList.add('dayMin');
  dayMin.textContent = min + unitSymbol;

  const iconCont = document.createElement('div');
  iconCont.classList.add('iconCont');

  const iconSVG = document.createElement('img');

  const iconName = getIconName(max, precip);
  const icon = getIcon(iconName);
  iconSVG.src = icon;
  iconSVG.classList.add('weatherIcon');

  dayCont.appendChild(dayTitle);
  dayCont.appendChild(dayMax);
  iconCont.appendChild(iconSVG);
  dayCont.appendChild(iconCont);
  dayCont.appendChild(dayMin);

  return dayCont;
};

const todaysForecastCont = document.querySelector('.todaysForecastCont');

const createTodaysForecast = (
  day,
  max,
  precip,
  temp = '22.0',
  location = 'London'
) => {
  const todayCont = document.createElement('div');
  todayCont.classList.add('todayCont');

  const todayLocation = document.createElement('div');
  todayLocation.classList.add('todayLocation');
  todayLocation.textContent = location;

  const todayTitle = document.createElement('div');
  todayTitle.classList.add('todayTitle');
  todayTitle.textContent = day;

  const nowTemp = document.createElement('div');
  nowTemp.classList.add('nowTemp');
  nowTemp.textContent = temp + unitSymbol;

  // const todayMax = document.createElement('div');
  // todayMax.classList.add('todayMax');
  // todayMax.textContent = max;

  // const todayMin = document.createElement('div');
  // todayMin.classList.add('todayMin');
  // todayMin.textContent = min;

  const todayPrecip = document.createElement('div');
  todayPrecip.classList.add('todayPrecip');
  todayPrecip.textContent = precip;

  // const todayCloud = document.createElement('div');
  // todayCloud.classList.add('todayCloud');
  // todayCloud.textContent = cloud;

  const iconCont = document.createElement('div');
  iconCont.classList.add('iconCont', 'todayIcon');

  const iconSVG = document.createElement('img');

  const iconName = getIconName(max, precip);
  const icon = getIcon(iconName);
  iconSVG.src = icon;
  iconSVG.classList.add('weatherIcon');

  todayCont.appendChild(todayLocation);

  todayCont.appendChild(todayTitle);

  todayCont.appendChild(nowTemp);

  //todayCont.appendChild(todayMax);
  //todayCont.appendChild(todayMin);

  //todayCont.appendChild(todayPrecip);
  //todayCont.appendChild(todayCloud);

  iconCont.appendChild(iconSVG);
  todayCont.appendChild(iconCont);
  //console.log(todayCont);

  return todayCont;
};

const addTodaysForecast = (day, max, precip, temp, resolvedAddress) => {
  const todayCont = createTodaysForecast(
    day,
    max,
    precip,
    temp,
    resolvedAddress
  );

  //console.log(todaysForecastCont);
  todaysForecastCont.appendChild(todayCont);
};

const weeklyForecastCont = document.querySelector('.weeklyForecastCont');

const addDay = (day, max, min, precip) => {
  const newDayObj = createDay(day, max, min, precip);
  weeklyForecastCont.appendChild(newDayObj);
};

const getIconName = (max, precipProb) => {
  //console.log(precipProb);
  if (precipProb >= 40) {
    if (max >= sunnyDayThreshold) {
      return 'rainWithSun';
    }
    return 'rainyDay';
  }
  if (max >= sunnyDayThreshold) {
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

const unitBtns = document.querySelectorAll('.unitBtn');

unitBtns.forEach((btn) => {
  btn.addEventListener('change', () => {
    //console.log(btn.value);
    unitGroup = btn.value;
    unitSymbol = unitGroup === 'metric' ? '°C' : '°F';
    sunnyDayThreshold = unitGroup === 'metric' ? 20 : 68;
    getForecasts(location, unitGroup, API_KEY);
  });
});
