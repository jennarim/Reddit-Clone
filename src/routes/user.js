const express = require('express'),
	  mongoose = require('mongoose'),
	  helper = require('./helper.js');

const User = mongoose.model('User')
const Category = mongoose.model('Category');
const Post = mongoose.model('Post');

router.get('/u/:username', (req, res) => {
	User.findOne({username: req.params.username})
		.populate({
			path: 'posts',
			populate: [{
				path: 'category',
				model: 'Category'
			},
			{
				path: 'author',
				model: 'User'
			}]
		})
		.exec((err, user) => {
			if (err) {
				helper.handleError(err, res);
			} else {
				res.render('user', {username: user.username, posts: user.posts});
			}
		});
});

module.exports = router;