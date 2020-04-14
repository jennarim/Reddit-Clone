const mongoose = require('mongoose'),
	  validate = require('mongoose-validator');

const usernameValidator = [
	validate({
		validator: 'isLength',
		arguments: [5,30],
		message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters.'
	}),
	validate({
		validator: 'isAlphanumeric',
		message: 'Name should contain alpha-numeric characters only'
	}),
];

module.exports = {
	usernameValidator,
}