export const YEAR_FILTER_ALL_TIME = 'ALL_TIME';

const YEAR_LOOKBACK = 5;

export const getYearFilterOptions = (referenceDate: Date = new Date()) => {
  const currentYear = referenceDate.getFullYear();
  const years = Array.from({ length: YEAR_LOOKBACK + 1 }, (_, i) => String(currentYear - i));

  return [{ label: 'All time', value: YEAR_FILTER_ALL_TIME }, ...years.map((year) => ({ label: year, value: year }))];
};

export const getYearScheduleRange = (year: string) => {
  if (year === YEAR_FILTER_ALL_TIME) return { scheduledFrom: undefined, scheduledTo: undefined };

  const numericYear = Number(year);
  const from = new Date(numericYear, 0, 1, 0, 0, 0, 0);
  const to = new Date(numericYear + 1, 0, 1, 0, 0, 0, 0);

  return { scheduledFrom: from.toISOString(), scheduledTo: to.toISOString() };
};
