const getDayFromDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-UK', { weekday: 'long' });
};

export { getDayFromDate };
