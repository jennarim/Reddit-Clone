const express = require('express'),
      mongoose = require('mongoose');

const User = mongoose.model('User');
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
							res.status(500).send({success:false});
						} else {
							// 3. Change this post's vote to new vote (e.g. from downvote to upvote)
							User.updateOne({_id: req.user._id, 'votedPosts.postId': postId}, {$set: {'votedPosts.$.vote': VOTE}}, (err) => {
								if (err) {
									console.log(err);
									res.status(500).send({success:false});
								} else {
									res.json({success: true, score: post.score, setUpvoteUI: (VOTE === UPVOTE), setDownvoteUI: (VOTE === DOWNVOTE)});
								}
							});
						}
					});
				} else {
					// The user had previously voted the same vote (e.g. user upvoted an already upvoted post).
					// 2. Revoke the vote by updating post's score
					const update = {score: (VOTE === UPVOTE? -1 : 1)};
					Post.findOneAndUpdate({_id: postId}, {$inc: update}, {new: true}, (err, post) => {
						if (err) {
							console.log(err);
							res.status(500).send({success:false});
						} else {
							// 3. Remove this post from user's voted posts
							User.updateOne({_id: req.user._id}, {$pull: {votedPosts: {postId: postId}}}, (err) => {
								if (err) {
									console.log(err);
									res.status(500).send({success:false});
								} else {
									res.json({success: true, score: post.score, setUpvoteUI: false, setDownvoteUI: false});
								}
							});
						}
					});
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
						// 2. Update user's votedPosts
						const votedPost = {postId: postId, vote: VOTE};
						User.findOneAndUpdate({_id: req.user._id}, {$addToSet: {votedPosts: votedPost}}, (err) => {
							if (err) {
								console.log(err);
								res.status(500).send({success:false});
							} else {
								res.json({success:true, score: post.score, setUpvoteUI: (VOTE === UPVOTE), setDownvoteUI: (VOTE === DOWNVOTE)});
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
		res.status(400).json({success:false});
	} else {
		const postId = req.body.postId;
		handleVote(req, res, postId, UPVOTE);
	}
});

router.post('/downvote', (req, res) => {
	if (!req.user) {
		res.status(400).json({success:false});
	} else {
		const postId = req.body.postId;
		handleVote(req, res, postId, DOWNVOTE);
	}
});

router.get('/votedPosts', (req, res) => {
	if (!req.user) {
		res.status(400).json({success:false});
	} else {
		User.findOne({_id: req.user._id}, (err, user) => {
			if (err) {
				res.status(500).json({success:false});
			} else {
				res.json(user.votedPosts);
			}
		});
	}
});

module.exports = router;