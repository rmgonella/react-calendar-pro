import moment from 'moment';

// Configurar moment para português
moment.locale('pt-br');

export const formatDate = (date, format = 'DD/MM/YYYY') => {
  return moment(date).format(format);
};

export const formatDateTime = (date) => {
  return moment(date).format('DD/MM/YYYY HH:mm');
};

export const formatTime = (date) => {
  return moment(date).format('HH:mm');
};

export const isToday = (date) => {
  return moment(date).isSame(moment(), 'day');
};

export const isPast = (date) => {
  return moment(date).isBefore(moment());
};

export const isFuture = (date) => {
  return moment(date).isAfter(moment());
};

export const getStartOfWeek = (date = new Date()) => {
  return moment(date).startOf('week').toDate();
};

export const getEndOfWeek = (date = new Date()) => {
  return moment(date).endOf('week').toDate();
};

export const getStartOfMonth = (date = new Date()) => {
  return moment(date).startOf('month').toDate();
};

export const getEndOfMonth = (date = new Date()) => {
  return moment(date).endOf('month').toDate();
};

export const addDays = (date, days) => {
  return moment(date).add(days, 'days').toDate();
};

export const subtractDays = (date, days) => {
  return moment(date).subtract(days, 'days').toDate();
};

export const createDateFromInputs = (date, time) => {
  const dateStr = moment(date).format('YYYY-MM-DD');
  return moment(`${dateStr} ${time}`).toDate();
};
