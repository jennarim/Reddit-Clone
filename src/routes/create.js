const express = require('express'),
      mongoose = require('mongoose'),
      helper = require('./helper.js');

const User = mongoose.model('User');
const Category = mongoose.model('Category');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

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

router.post('/comment', (req, res) => {
	if (!req.user) {
		res.status(400).json({success:false});
	} else {
		const postTitle = req.body.postTitle;
		Post.findOne({slug: postTitle}, (err, post) => {
			if (err) {
				res.status(500).json({success:false});
			} else {
				new Comment({
					content: req.body.content,
					byUser: req.user._id,
					onPost: post._Id,
					createdAt: new Date()
				}).save((err, comment) => {
					if (err) {
						res.status(500).json({success:false});
					} else {
						post.comments.push(comment);
						post.save((err) => {
							if (err) {
								res.status(500).json({success:false});
							} else {
								res.status(200).json({comment, success:true});
							}
						});
					}
				});
			}
		});
	}
});

module.exports = router;