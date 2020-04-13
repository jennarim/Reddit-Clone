const express = require('express'),
	  passport = require('passport'),
	  mongoose = require('mongoose'),
	  helper = require('./helper.js');

const User = mongoose.model('User')
const Category = mongoose.model('Category');
const Post = mongoose.model('Post');

const router = express.Router();

router.get('/', (req, res) => {
	Post.find({})
		.populate('category', 'name')
		.populate('author')
		.exec((err, posts) => {
			if (err) {
				helper.handleError(err, res);
			} else {
				posts.sort(helper.comparePostsByDate).reverse();
				helper.log("Posts", posts);
				res.render('all', {posts});
			}
	});
});

module.exports = router;