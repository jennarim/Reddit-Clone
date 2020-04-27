const express = require('express'),
	  passport = require('passport'),
	  mongoose = require('mongoose'),
	  helper = require('./helper.js');

const User = mongoose.model('User')
const Category = mongoose.model('Category');
const Post = mongoose.model('Post');

const router = express.Router();

router.get('/login', helper.ensureLoggedOut, (req, res) => {
	res.render('login');
});

router.get('/register', helper.ensureLoggedOut, (req, res) => {
	res.render('register');
});

router.post('/login', (req, res) => {
	passport.authenticate('local', (err, user) => {
		if (err) {
			console.log(err);
		} else if (user) {
			req.logIn(user, (err) => {
				if (err) {
					console.log(err);
				} else {
					res.redirect('/');
				}
			});
		} else {
			res.render('login', {err});
		}
	})(req, res);
});

router.post('/register', (req, res) => {
	if (req.body.password !== req.body.passwordConfirmation) {
		res.render('register', {err: {errors: [{message: 'Passwords do not match.'}]}})
	} else {
		const newUser = new User({username: req.body.username, password: req.body.password});
		newUser.validate((err) => {
			if (err) {
				res.render('register', {err});
			} else {
				User.register(newUser,
					req.body.password, (err, user) => {
						if (err) {
							err.errors = [{message: err.message}];
							console.log(err);
							res.render('register', {err})
						} else {
							passport.authenticate('local')(req, res, () => {
								res.redirect('/');
							});
						}
				});
			}
		});
	}	
});

router.get('/logout', helper.ensureLoggedIn, (req, res) => {
	req.logout();
	helper.log("Logged out. req.user:", req.user);
	res.redirect('/');
});

module.exports = router;