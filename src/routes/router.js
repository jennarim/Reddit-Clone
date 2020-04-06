const express = require('express'),
	  passport = require('passport'),
	  mongoose = require('mongoose');

const User = mongoose.model('User')
const Category = mongoose.model('Category');
const Post = mongoose.model('Post');

const router = express.Router();

function ensureLoggedIn(req, res, next) {
	if (req.user) {

		next();
	} else {
		res.redirect('/register');
	}
}

function ensureLoggedOut(req, res, next) {
	if (!req.user) {
		next();
	} else {
		res.redirect('/');
	}
}

function comparePostsByDate(a, b) {
	if (a.createdAt.getTime() < b.createdAt.getTime()) {
		return -1;
	} else if  (a.createdAt.getTime() > b.createdAt.getTime()) {
		return 1;
	} else {
		return 0;
	}
}



router.get('/login', ensureLoggedOut, (req, res) => {
	res.render('login');
});

router.get('/register', ensureLoggedOut, (req, res) => {
	res.render('register');
});

router.post('/login', (req, res) => {
	passport.authenticate('local', (err, user) => {
		if (user) {
			req.logIn(user, (err) => {
				// res.locals.userId 
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

router.get('/logout', ensureLoggedIn, (req, res) => {
	req.logout();
	res.redirect('/');
});

function getAllPosts(posts, postIds, res) {
	if (postIds.length === 0) {
		posts.sort(comparePostsByDate).reverse();
		res.render('all', {posts});
		return;
	}
	Post.findOne({_id: postIds[0]}, (err, post) => {
		if (err) {
			console.log(err);
		} else {
			posts.push(post);
			postIds.shift();
			getAllPosts(posts, postIds, res);
		}
	});
}

router.get('/', (req, res) => {
	// res.send("test");
// 	const context = {
// 		language: 'handlebars',
// 		adjective: 'fun'
// 	};
// 	console.log(Handlebars.partials);
// 	res.render('partialtest', context);
	console.log(req.user);
	Category.find({}, (err, categories) => {
		if (err) {
			console.log(err);
		} else {
			const allPostIds = [];
			console.log(categories);
			categories.forEach((category) => {
				category.posts.forEach(postId => {
					allPostIds.push(postId);
				});
			});
			const posts = [];
			getAllPosts(posts, allPostIds, res);
		}
	});
});

router.get('/c/:category', (req, res) => {
	Category.findOne({name: req.params.category}, (err, category) => {
		if (err) {
			console.log(err);
		} else if (!category) {
			res.send('not valid category');
		} else {
			Post.find({category: category["_id"]}, (err, posts) => {
				if (err) {
					console.log(err);
				} else {
					// console.log(posts);
					res.render('category', {categoryName: req.params.category, posts});
				}
			});	
		}
	});
});

router.get('/create', ensureLoggedIn, (req, res) => {
	res.render('create');
});

function redirectToCategoryPage(post, objectId, res) {
	Category.findOne({_id: objectId}, (err, category) => {
		if (err) {
			console.log(err);
		} else {
			category.posts.push(post["_id"]);
			category.save((err) => {
				if (err) {
					console.log(err);	
				} else {
					res.redirect('/c/' + category.name);
				}
			});
		}
	});
}

router.post('/create', ensureLoggedIn, (req, res) => {
	new Post({
		category: req.body.category,
		title: req.body.title,
		type: req.body.type,
		body: req.body.body,
		author: req.user["_id"],
		createdAt: new Date()
	}).save((err, post) => {
		if (err) {
			console.log(err);
		} else {
			redirectToCategoryPage(post, req.body.category, res);
		}
	});
});

module.exports = router;