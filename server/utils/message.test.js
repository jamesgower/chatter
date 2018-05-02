const expect = require('expect');
const { generateMessage } = require('./message');

describe('generateMessage', () => {
	it('should generate the correct message object', () => {
		const message = generateMessage('jill@example.com', 'Hi, this is a test');
		expect(message).toMatchObject({
			sender: 'jill@example.com',
			text: 'Hi, this is a test'
		});
		expect(typeof message).toBe('object');
		expect(typeof message.createdAt).toBe('number');
	})
})