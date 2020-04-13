const express = require('express'),
	  mongoose = require('mongoose'),
	  helper = require('./helper.js');

const User = mongoose.model('User')
const Category = mongoose.model('Category');
const Post = mongoose.model('Post');

const router = express.Router();

router.get('/u/:username', (req, res) => {
	User
		.findOne({username: req.params.username})
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
				helper.handleError(res, 'user', err);
			} else if (!user) {
				res.send('user dne');
			} else {
				res.render('user', {username: user.username, posts: user.posts});
			}
		});
});

module.exports = router;