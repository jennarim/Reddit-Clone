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
		res.status(300).json({success:false});
	} else {
		const postId = req.body.postId;
		User.findOne({_id: req.user._id}, (err, user) => {
			if (err) {
				console.log(err);
				res.status(500).send({success:false});
			} else {
				// Remove the post that the user already voted on				
				const indexOfDuplicateVote = user.votedPosts.findIndex(votedPost => (votedPost.postId+'') === (postId+''));
				const userAlreadyVoted = indexOfDuplicateVote != -1;
				if (userAlreadyVoted) {
					const onDifferentPost = user.votedPosts[indexOfDuplicateVote].vote === -1; 
					if (onDifferentPost) {
						for (const votedPostIndex in user.votedPosts) {
							const votedPost = user.votedPosts[votedPostIndex];
							if ((votedPost.postId+'') === (postId+'')) {
								// First update the post's total score
								Post.updateOne({_id: postId}, {$inc: {score: 1}}, {new: true}, (err) => {
									if (err) {
										console.log(err);
										res.status(500).send({success:false});
									} else {
										// Then delete from user's votedPosts
										user.votedPosts.splice(votedPostIndex, 1);
										user.save((err) => {
											if (err) {
												console.log(err);
												res.status(500).send({success:false});
											} else {
												const votedPost = {postId: postId, vote: 1};
												// Update user's votedPosts
												User.updateOne({_id: req.user._id}, {$addToSet: {votedPosts: votedPost}}, (err, count) => {
													if (err) {
														console.log(err);
														res.status(500).send({success:false});
													} else {
														const postAdded = count.nModified > 0;
														if (postAdded) {
															// Update post's total score
															Post.findOneAndUpdate({_id: postId}, {$inc: {score: 1}}, {new: true}, (err, post) => {
																if (err) {
																	console.log(err);
																	res.status(500).send({success:false});
																} else {
																	res.json({success:true, score: post.score});
																}
															});
														} else {
															console.log('user already upvoted. this request didnt do anything.');
														}
													}
												});
											}
										});
									}
								});
							}
						}
					}
				} else {
					const votedPost = {postId: postId, vote: 1};
					// Update user's votedPosts
					User.updateOne({_id: req.user._id}, {$addToSet: {votedPosts: votedPost}}, (err, count) => {
						if (err) {
							console.log(err);
							res.status(500).send({success:false});
						} else {
							const postAdded = count.nModified > 0;
							if (postAdded) {
								// Update post's total score
								Post.findOneAndUpdate({_id: postId}, {$inc: {score: 1}}, {new: true}, (err, post) => {
									if (err) {
										console.log(err);
										res.status(500).send({success:false});
									} else {
										res.json({success:true, score: post.score});
									}
								});
							} else {
								console.log('user already upvoted. this request didnt do anything.');
							}
						}
					});
				}
			}
		});
	}
});

router.post('/downvote', (req, res) => {
	if (!req.user) { 
		res.status(300).json({success:false});
	} else {
		const postId = req.body.postId;
		User.findOne({_id: req.user._id}, (err, user) => {
			if (err) {
				console.log(err);
				res.status(500).send({success:false});
			} else {
				// Remove the post that the user already voted on				
				const indexOfDuplicateVote = user.votedPosts.findIndex(votedPost => (votedPost.postId+'') === (postId+''));
				const userAlreadyVoted = indexOfDuplicateVote !== -1;
				if (userAlreadyVoted) {
					const onDifferentPost = user.votedPosts[indexOfDuplicateVote].vote === 1; 
					if (onDifferentPost) {
						console.log('user upvoted previously');
						for (const votedPostIndex in user.votedPosts) {
							const votedPost = user.votedPosts[votedPostIndex];
							if ((votedPost.postId+'') === (postId+'')) {
								// First update the post's total score
								Post.updateOne({_id: postId}, {$inc: {score: -1}}, {new: true}, (err) => {
									if (err) {
										console.log(err);
										res.status(500).send({success:false});
									} else {
										console.log("before (should have st)", user.votedPosts);
										// Then delete from user's votedPosts
										user.votedPosts.splice(votedPostIndex, 1);
										user.save((err) => {
											if (err) {
												console.log(err);
												res.status(500).send({success:false});
											} else {
												console.log("after (should have nothing)", user.votedPosts);
												// *
												const votedPost = {postId: postId, vote: -1};
												User.updateOne({_id: req.user._id}, {$addToSet: {votedPosts: votedPost}}, (err, count) => {
													if (err) {
														console.log(err);
														res.status(500).send({success:false});
													} else {
														const postAdded = count.nModified > 0;
														if (postAdded) {
															console.log("there was no duplicate. successful addition");
															Post.findOneAndUpdate({_id: postId}, {$inc: {score: -1}}, {new: true}, (err, post) => {
																if (err) {
																	console.log(err);
																	res.status(500).send({success:false});
																} else {
																	res.json({success:true, score: post.score});
																}
															});
														} else {
															console.log('user already downvoted. this request didnt do anything.');
														}
													}
												});


											}
										});
									}
								});
							}
						}
					}
				} else {
					const votedPost = {postId: postId, vote: -1};
					User.updateOne({_id: req.user._id}, {$addToSet: {votedPosts: votedPost}}, (err, count) => {
						if (err) {
							console.log(err);
							res.status(500).send({success:false});
						} else {
							const postAdded = count.nModified > 0;
							if (postAdded) {
								console.log("there was no duplicate. successful addition");
								Post.findOneAndUpdate({_id: postId}, {$inc: {score: -1}}, {new: true}, (err, post) => {
									if (err) {
										console.log(err);
										res.status(500).send({success:false});
									} else {
										res.json({success:true, score: post.score});
									}
								});
							} else {
								console.log('user already downvoted. this request didnt do anything.');
							}
						}
					});
				}
			}
		});
	}
});

module.exports = router;