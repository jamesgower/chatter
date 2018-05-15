const moment = require('moment');

const generateMessage = (sender, text) => {
	return {
		sender,
		text,
		createdAt: moment().valueOf(),
	};
};

const generateLocationMessage = (sender, latitude, longitude) => {
	const url = `https://www.google.co.uk/maps?q=${latitude},${longitude}`;
	return {
		sender,
		url,
		createdAt: moment().valueOf(),
	};
};

module.exports = { generateMessage, generateLocationMessage };
