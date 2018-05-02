const generateMessage = (sender, text) => {
	return {
		sender,
		text,
		createdAt: new Date().getTime(),
	};
};

const generateLocationMessage = (sender, latitude, longitude) => {
	const url = `https://www.google.co.uk/maps?q=${latitude},${longitude}`;
	return {
		sender,
		url,
		createdAt: new Date().getTime(),
	};
};

module.exports = { generateMessage, generateLocationMessage };
