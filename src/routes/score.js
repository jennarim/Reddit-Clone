const express = require('express'),
	  mongoose = require('mongoose'),
	  helper = require('./helper.js');

const User = mongoose.model('User')
const Category = mongoose.model('Category');
const Post = mongoose.model('Post');

const router = express.Router();

router.use(express.urlencoded({extended: false}));

const DOWNVOTE = -1;
const UPVOTE = 1;

function handleVote(req, res, postId, VOTE) {
	const OPPOSITE_VOTE = (VOTE === UPVOTE? DOWNVOTE : UPVOTE);

	User.findOne({_id: req.user._id}, (err, user) => {
		if (err) {
			console.log(err);
			res.status(500).send({success:false});
		} else {
			// 1. Check if the user already voted on this post			
			const indexOfDuplicateVote = user.votedPosts.findIndex(votedPost => (votedPost.postId+'') === (postId+'')),
				  userAlreadyVoted = indexOfDuplicateVote !== -1;

			if (userAlreadyVoted) {
				// The user already voted on this post (either upvote or downvote)
				const userVotedOpposite = user.votedPosts[indexOfDuplicateVote].vote === OPPOSITE_VOTE; 
				if (userVotedOpposite) { 
					// The user had previously voted opposite (e.g. user pressed upvote, but had downvoted previously)
					// 2. Update the post's total score by revoking the vote and applying the recent vote (e.g. revoke downvote and upvote -> increase score by 2)
					const update = {score: (VOTE === UPVOTE? 2 : -2)};
					Post.findOneAndUpdate({_id: postId}, {$inc: update}, {new: true}, (err, post) => {
						if (err) {
							console.log(err);
							return res.status(500).send({success:false});
						} else {
							// 3. Change this post's vote from to new vote (e.g. from downvote to upvote)
							User.updateOne({_id: req.user._id, 'votedPosts.postId': postId}, {$set: {'votedPosts.$.vote': VOTE}}, (err) => {
								if (err) {
									console.log(err);
									res.status(500).send({success:false});
								} else {
									res.json({success: true, score: post.score});
								}
							});
						}
					});
				} else {
					// The user had previously voted the same vote (e.g. user upvoted an already upvoted post). Ignore the request. 
					res.json({success: false});
				}
			} else {
				// The user had never voted on this post before
				// 1. Increment/decrement the post's total score
				const update = {score: (VOTE === UPVOTE? 1 : -1)};
				Post.findOneAndUpdate({_id: postId}, {$inc: update}, {new: true}, (err, post) => {
					if (err) {
						console.log(err);
						res.status(500).send({success:false});
					} else {
						console.log('this post has been upvoted, now score is', post.score);
						// 2. Update user's votedPosts
						const votedPost = {postId: postId, vote: VOTE};
						User.findOneAndUpdate({_id: req.user._id}, {$addToSet: {votedPosts: votedPost}}, (err) => {
							if (err) {
								console.log(err);
								res.status(500).send({success:false});
							} else {
								console.log('this post was added to user votedPosts');
								console.log('the score is now', post.score);
								res.json({success:true, score: post.score});
							}
						});
					}
				});
			}
		}
	});
}

router.post('/upvote', (req, res) => {
	if (!req.user) {
		res.status(300).json({success:false});
	} else {
		const postId = req.body.postId;
		handleVote(req, res, postId, UPVOTE);
	}
});

router.post('/downvote', (req, res) => {
	if (!req.user) {
		res.status(300).json({success:false});
	} else {
		const postId = req.body.postId;
		handleVote(req, res, postId, DOWNVOTE);
	}
});

module.exports = router;