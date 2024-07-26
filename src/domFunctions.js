import sunnyDayIcon from './images/sunnyDayAnimated.svg';
import cloudyDayIcon from './images/cloudyDayAnimated.svg';
import rainyDayIcon from './images/rainyDayAnimated.svg';
import rainWithSunIcon from './images/rainWithSunAnimated.svg';
import umbrellaSunIcon from './images/umbrella-sunny.svg';
import umbrellaRainIcon from './images/umbrella-rainy.svg';

const getIconName = (max, precipProb, sunnyDayThreshold) => {
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

// Dom Functions

const createTodaysForecast = (
  day,
  max,
  precip,
  temp = '22.0',
  location = 'London',
  sunnyDayThreshold,
  unitSymbol
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

  const todayPrecip = document.createElement('div');
  todayPrecip.classList.add('todayPrecip');
  todayPrecip.textContent = precip;

  const iconCont = document.createElement('div');
  iconCont.classList.add('iconCont', 'todayIcon');

  const iconSVG = document.createElement('img');

  const iconName = getIconName(max, precip, sunnyDayThreshold);
  const icon = getIcon(iconName);
  iconSVG.src = icon;
  iconSVG.classList.add('weatherIcon');

  todayCont.appendChild(todayLocation);

  todayCont.appendChild(todayTitle);

  todayCont.appendChild(nowTemp);

  iconCont.appendChild(iconSVG);
  todayCont.appendChild(iconCont);

  return todayCont;
};

const createPrecipForecast = (precip) => {
  const precipCont = document.createElement('div');
  precipCont.classList.add('precipCont');

  const precipTitle = document.createElement('div');
  precipTitle.classList.add('precipTitle');
  precipTitle.textContent = 'Chance of Rain:';

  const precipPercent = document.createElement('div');
  precipPercent.classList.add('precipPercent');
  precipPercent.textContent = `${precip}%`;

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

const createDay = (day, max, min, precip, unitSymbol, sunnyDayThreshold) => {
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

  const iconName = getIconName(max, precip, sunnyDayThreshold);
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

const updateTodaysForecast = (
  day,
  max,
  precip,
  temp,
  resolvedAddress,
  sunnyDayThreshold = 40,
  unitSymbol = '°C'
) => {
  const todaysForecastCont = document.querySelector('.todaysForecastCont');
  todaysForecastCont.innerHTML = '';

  const todayCont = createTodaysForecast(
    day,
    max,
    precip,
    temp,
    resolvedAddress,
    sunnyDayThreshold,
    unitSymbol
  );

  todaysForecastCont.appendChild(todayCont);
};

const updatePrecipForecast = (precip) => {
  const rightSideCont = document.querySelector('.rightSideCont');
  rightSideCont.innerHTML = '';
  const precipCont = createPrecipForecast(precip);
  rightSideCont.appendChild(precipCont);
};

const updateWeeklyForecast = (next10days, unitSymbol, sunnyDayThreshold) => {
  const weeklyForecastCont = document.querySelector('.weeklyForecastCont');
  weeklyForecastCont.innerHTML = '';

  next10days.forEach((day) => {
    const newDay = createDay(
      day.day,
      day.max,
      day.min,
      day.precip,
      unitSymbol,
      sunnyDayThreshold
    );
    weeklyForecastCont.append(newDay);
  });
};

export { updateTodaysForecast, updatePrecipForecast, updateWeeklyForecast };
