exports.formatDateWithDayID = (isoString) => {
  if (!isoString) return null;

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(isoString));
};

// utilities/function.js
exports.parseGTenaga = (gTenaga) => {
  if (!gTenaga) return [];

  return gTenaga
    .replace(/[{}]/g, '')
    .split(',')
    .map(x => x.trim())
    .filter(Boolean);
};
