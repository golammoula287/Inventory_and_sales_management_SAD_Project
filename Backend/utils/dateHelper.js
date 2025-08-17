const moment = require('moment');

const formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

const getStartOfMonth = () => {
  return moment().startOf('month').format('YYYY-MM-DD');
};

const getEndOfMonth = () => {
  return moment().endOf('month').format('YYYY-MM-DD');
};

module.exports = { formatDate, getStartOfMonth, getEndOfMonth };
