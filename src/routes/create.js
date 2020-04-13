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
		createdAt: new Date()
	}).save((err, post) => {
		if (err) {
			helper.handleError(err, res);
		} else {
			User.updateOne({_id: req.user._id}, {$push: {posts: post._id}})
			.then(() => {
				Category.findOneAndUpdate({_id: post.category}, {$push: {posts: post._id}}, {new: true}, (err, category) => {
					console.log("* CAT", category);
					res.redirect('/c/' + category.name);
				});
			});
		}
	});
});

module.exports = router;