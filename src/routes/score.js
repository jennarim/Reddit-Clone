const express = require('express'),
	  mongoose = require('mongoose'),
	  helper = require('./helper.js');

const User = mongoose.model('User')
const Category = mongoose.model('Category');
const Post = mongoose.model('Post');

const router = express.Router();

router.use(express.urlencoded({extended: false}));

router.post('/upvote', (req, res) => {
	if (!req.user) {
		res.status(302).send();
	} else {
	 	Post.findOne({_id: req.body.postId}, (err, post) => {
	 		if (err) {
	 			res.status(500).send();
	 		} else {
	 			const userWantsToUpvote = req.body.upvoted;
	 			if (userWantsToUpvote === 'true') {
	 				console.log('~ user wants to upvote', post.title);
	 				const userAlreadyIncluded = post.upvotedUsers.includes(req.body.postId);
	 				if (userAlreadyIncluded) {
	 					console.log('~~ she already did though', post.title);
	 					res.status(400).send();
	 				} else {
	 					console.log('~ success!!', post.title);
	 					post.upvotedUsers.addToSet(req.user._id);
	 					post.save();
	 					res.status(200).send();
	 				}
	 			} else {
	 				// User wants to revoke upvote
	 				console.log('~ user wants to revoke', post.title);
	 				Post.updateOne({_id: req.body.postId}, {$pull: {upvotedUsers: req.user._id}}, (err, post) => {
	 					if (err) {
	 						res.status(500).send();
	 					} else {
	 						console.log('~ success!!');
	 						res.status(200).send();
	 					}
	 				});
	 			}
	 		}
	 	});
	}
	// check if user is logged in
	// update post by insert user 
	// if err
		// send 500?
	// else
		// send 200?
});


module.exports = router;