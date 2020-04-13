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
		if (user) {
			req.logIn(user, (err) => {
				res.redirect('/');
			});
		} else {
			res.render('login', {message: 'Your login or password is incorrect.'});
		}
	})(req, res);
});

router.post('/register', (req, res) => {
	User.register(new User({username: req.body.username, password: req.body.password}),
		req.body.password, (err, user) => {
			if (err) {
				res.render('register', {message:'Your registration info is not valid.'})
			} else {
				passport.authenticate('local')(req, res, () => {
					res.redirect('/');
				});
			}
	});
});

router.get('/logout', helper.ensureLoggedIn, (req, res) => {
	req.logout();
	helper.log("Logged out. req.user:", req.user);
	res.redirect('/');
});

module.exports = router;