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

function log(name, content) {
	console.log(name, ":");
	console.log(content);
	console.log("##########");
}

function getAllPosts(categories) {
	const posts = [];
	categories.forEach(category => {
		category.posts.forEach(post => {
			posts.push(post);
		});
	});
	return posts;
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
	log("Logged out. req.user:", req.user);
	res.redirect('/');
});

// function getAllPosts(posts, postIds, res) {
// 	if (postIds.length === 0) {
// 		posts.sort(comparePostsByDate).reverse();
// 		res.render('all', {posts});
// 	} else {
// 		Post.findOne({_id: postIds[0]}, (err, post) => {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				posts.push(post);
// 				postIds.shift();
// 				getAllPosts(posts, postIds, res);
// 			}
// 		});
// 	}
// }

router.get('/', (req, res) => {
	// res.send("test");
// 	const context = {
// 		language: 'handlebars',
// 		adjective: 'fun'
// 	};
// 	console.log(Handlebars.partials);
// 	res.render('partialtest', context);
	// console.log(req.user);

	// Populate Category's own fields
	// Category.find({}).populate('posts').exec((err, categories) => {
	// 	console.log("Populated Category ", categories);
	// 	Category.find({}, (err, categories) => {
	// 		console.log("Looking at categories again", categories);
	// 	});
	// });

	Category.find({}).populate('posts').exec((err, categories) => {
		if (err) {
			console.log(err);
		} else {
			const posts = getAllPosts(categories);
			posts.sort(comparePostsByDate).reverse();

			log("Posts", posts);
			res.render('all', {posts});
		}
	});
});

router.get('/c/:category', (req, res) => {
	Category.findOne({name: req.params.category}, (err, category) => {
		if (err) {
			console.log(err);
		} else if (!category) {
			res.send('not valid category');
		}
	}).populate('posts').exec((err, category) => {
		if (err) {
			console.log(err);
		} else {
			res.render('category', {categoryName: category.name, posts: category.posts});
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
			// Add this post to Author's posts
			User.findOne({_id: req.user._id}, (err, user) => {
				user.posts.push(post._id);
			});

			log("New Post has been created.", post);

			redirectToCategoryPage(post, req.body.category, res);
		}
	});
});

module.exports = router;