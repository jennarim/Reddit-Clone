const express = require('express'),
	  mongoose = require('mongoose'),
	  helper = require('./helper.js');

const User = mongoose.model('User')
const Category = mongoose.model('Category');
const Post = mongoose.model('Post');

const router = express.Router();

router.get('/create', helper.ensureLoggedIn, (req, res) => {
	res.render('create');
});

router.post('/create', helper.ensureLoggedIn, (req, res) => {
	new Post({
		category: req.body.category,
		title: req.body.title,
		type: req.body.type,
		body: req.body.body,
		author: req.user._id,
		score: 0,
		createdAt: new Date()
	}).save((err, post) => {
		if (err) {
			helper.handleError(res, 'create', err);
		} else {
			User.updateOne({_id: req.user._id}, {$push: {posts: post._id}})
			.then(() => {
				Category.findOneAndUpdate({_id: post.category}, {$push: {posts: post._id}}, {new: true}, (err, category) => {
					if (err) {
						helper.handleError(res, 'category', err);
					} else if (!category) {
						res.send('not valid category');
					} else {
						res.redirect('/c/' + category.name);
					}
				});
			});
		}
	});
});

module.exports = router;