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


router.get('/', (req, res) => {
	// res.send("test");
// 	const context = {
// 		language: 'handlebars',
// 		adjective: 'fun'
// 	};
// 	console.log(Handlebars.partials);
// 	res.render('partialtest', context);
	Post.find({})
		.populate('category', 'name')
		.populate('author')
		.exec((err, posts) => {
			if (err) {
				console.log(err);
			} else {
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
	})
	.populate({
		path: 'posts',
		populate: { 
			path: 'author',
			model: 'User'
		}
	})
	.exec((err, category) => {
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
	
}

router.post('/create', ensureLoggedIn, (req, res) => {
	new Post({
		category: req.body.category,
		title: req.body.title,
		type: req.body.type,
		body: req.body.body,
		author: req.user._id,
		createdAt: new Date()
	}).save((err, post) => {
		if (err) {
			console.log(err);
		} else {
			// Add this post to Author's posts
			// User.findOne({_id: req.user._id}, (err, user) => {
			// 	if (err) {
			// 		console.log(err);
			// 	} else {
			// 		user.posts.push(post._id);
			// 		user.save((err, user) => {
			// 			log("New Post has been created.", post);
			// 			redirectToCategoryPage(post, req.body.category, res);
			// 		});
			// 	}
			// });
			User.updateOne({_id: req.user._id}, {$push: {posts: post._id}})
			.then(() => {
				Category.findOneAndUpdate({_id: post.category}, {$push: {posts: post._id}}, {new: true}, (err, category) => {
					console.log("* CAT", category);
					res.redirect('/c/' + category.name);
				});
			});
			// .then(() => {
				
			// });

			// Add this post to Category's posts
			// Category.findOne({_id: post.category}, (err, category) => {
			// 	if (err) {
			// 		console.log(err);
			// 	} else {
			// 		category.posts.push(post._id);
			// 		category.save((err) => {
			// 			if (err) {
			// 				console.log(err);	
			// 			} else {
			// 				res.redirect('/c/' + category.name);
			// 			}
			// 		});
			// 	}
			// });
		}
	});
});

router.get('/c/:category/:postSlug', (req, res) => {
	Category.findOne({name: req.params.category}, (err, category) => {
		if (err) {
			console.log(err);
		} else {
			Post.findOne({slug: req.params.postSlug}, (err, post) => {
				if (err) {
					console.log(err);
				} else {
					res.render('post', {post});
				}
			});
		}
	});
});

router.get('/u/:username', (req, res) => {
	User.findOne({username: req.params.username})
		.populate({
			path: 'posts',
			populate: {
				path: 'category',
				model: 'Category'
			}
		})
		.exec((err, user) => {
			if (err) {
				console.log(err);
			} else {
				res.render('user', {username: user.username, posts: user.posts});
			}
		});
});

module.exports = router;