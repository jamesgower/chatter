const axios = require('axios');

const getExchangeRate = async (from, to) => {
	try {
		const res = await axios.get(`http://api.fixer.io/latest?base=${from}`);
		const rate = res.data.rates[to];
		if (rate) {
			return rate;
		} else {
			throw new Error();
		}
	} catch (e) {
		throw new Error(`Unable to get exchange rate for ${from} to ${to}`);
	}
};

const getCountries = async code => {
	try {
		const res = await axios.get(`https://restcountries.eu/rest/v2/currency/${code}`);
		return res.data.map(country => country.name);
	} catch (e) {
		throw new Error(`Unable to get countries that use ${code}`);
	}
};

const convertCurrency = async (from, to, amount) => {
	const countries = await getCountries(to);
	const rate = await getExchangeRate(from, to);
	const exchangedAmount = amount * rate;
	return `${amount} ${from} is worth ${exchangedAmount} ${to}. \n${to} can be used in the following countries: ${countries.join(
		', '
	)}`;
};

// getExchangeRate('USD', 'GBP').then(rate => console.log(rate));
// getCountries('GBP').then(countries => console.log(countries));
convertCurrency('GBP', 'EUR', 100)
	.then(status => console.log(status))
	.catch(e => console.log(e.message));
