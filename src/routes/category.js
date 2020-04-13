const express = require('express'),
	  mongoose = require('mongoose'),
	  helper = require('./helper.js');

const User = mongoose.model('User')
const Category = mongoose.model('Category');
const Post = mongoose.model('Post');

const router = express.Router();

router.get('/c/:category', (req, res) => {
	Category.findOne({name: req.params.category}, (err, category) => {
		if (err) {
			helper.handleError(err, res);
		} else if (!category) {
			res.send('not valid category');
		}
	})
	.populate({
		path: 'posts',
		populate: [{ 
			path: 'author',
			model: 'User'
		},
		{
			path: 'category',
			model: 'Category'
		}]
	})
	.exec((err, category) => {
		if (err) {
			helper.handleError(err, res);
		} else {
			res.render('category', {categoryName: category.name, posts: category.posts});
		}	
	});
});

router.get('/c/:category/:postSlug', (req, res) => {
	Category.findOne({name: req.params.category}, (err, category) => {
		if (err) {
			helper.handleError(err, res);
		} else if (!category) {
			res.render('not a valid category');
		}
	})
	.exec((err, category) => {
		Post.findOne({slug: req.params.postSlug}, (err, post) => {
			if (err) {
				helper.handleError(err, res);
			} else if (!post) {
				res.render('not a valid post');
			}
		})
		.populate('author', 'username')
		.populate('category', 'name')
		.exec((err, post) => {
			console.log(post);
			res.render('post', {post});
		});
	});
});

module.exports = router;