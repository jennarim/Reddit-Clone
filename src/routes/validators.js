// const mongoose = require('mongoose'),
// 	  mv = require('mongoose-validator');

// require('./db.js');

// const Category = mongoose.model('Category')
// 	  User = mongoose.model('User');

// mv.extend('isValidCategory', val => {
// 	return Category.exists({name: val}, (err, category) => {
// 		if (err) {
// 			console.log('Error while finding whether category exists.');
// 		}
//  	});
// });

// mv.extend('isValidUser', val => {
// 	return User.exists({_id: val}, (err, user) => {
// 		if (err) {
// 			console.log('Error while finding whether user exists.');
// 		}
// 	});
// });
/* User Validators */
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

const passwordValidator = validate({
	validator: 'isLength',
	arguments: [8,30],
	message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters.'
});

/* Post Validators */
// const categoryValidator = validate({
// 	validator: 'isValidCategory',
// 	message: 'Not a valid category.'
// });

const titleValidator = validate({
	validator: 'isLength',
	arguments: [1,200],
	message: 'Title should be between {ARGS[0]} and {ARGS[1]} characters.'
});

const bodyValidator = validate({
	validator: 'isLength',
	arguments: [1, 1000],
	message: 'Post content should be between {ARGS[0]} and {ARGS[1]} characters.'
});


// const userValidator = validate({
// 	validator: 'isValidUser',
// 	message: 'Not a valid user,'
// });


// module.exports = {
// 	usernameValidator,
// 	passwordValidator,
// 	titleValidator,
// 	bodyValidator,
// };