const express = require('express'),
	  passport = require('passport'),
	  mongoose = require('mongoose');

const User = mongoose.model('User')
const Category = mongoose.model('Category');
const Post = mongoose.model('Post');

const router = express.Router();

router.get('/', (req, res) => {
	// res.send("test");
// 	const context = {
// 		language: 'handlebars',
// 		adjective: 'fun'
// 	};
// 	console.log(Handlebars.partials);
// 	res.render('partialtest', context);
	res.send("hi");
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.get('/register', (req, res) => {
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



router.get('/c/:category', (req, res) => {
	Category.findOne({name: req.params.category}, (err, category) => {
		if (err) {
			console.log(err);
		} else {
			Post.find({category: category["_id"]}, (err, posts) => {
				if (err) {
					console.log(err);
				} else {
					console.log(posts);
					res.render('category', {category, posts});
				}
			});	
		}
	});
});

router.get('/create', (req, res) => {

	res.render('create');
});

router.post('/create', (req, res) => {
	// new Post({
	// 	category: 
	// })
	// make sure to add the post into category's posts
	res.redirect('/');
});

module.exports = router;