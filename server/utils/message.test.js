const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
	it('should generate the correct message object', () => {
		const message = generateMessage('jill@example.com', 'Hi, this is a test');
		expect(message).toMatchObject({
			sender: 'jill@example.com',
			text: 'Hi, this is a test',
		});
		expect(typeof message).toBe('object');
		expect(typeof message.createdAt).toBe('number');
	});
});

describe('generateLocationMessage', () => {
	it('should generate correct location message object', () => {
		const lat = 100;
		const lng = 235;
		const message = generateLocationMessage('Admin', lat, lng);
		expect(message).toMatchObject({
			sender: 'Admin',
			url: `https://www.google.co.uk/maps?q=${lat},${lng}`
		});
		expect(typeof message).toBe('object');		
		expect(typeof message.createdAt).toBe('number');
	});
})