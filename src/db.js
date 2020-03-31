const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
	category:  {type: String, required: true},
	title: 	   {type: String, required: true},
	type: 	   {type: String, required: true},
	body: 	   {type: String, required: true},
	username:  {type: String, required: true},
	createdAt: {type: Date, required: true},
});

const userSchema = mongoose.Schema({
	username: {type: String, required: true},
	hash: 	  {type: String, required: true},
	posts:    [{type: Schema.ObjectId, ref: 'Post'}]
});

const categorySchema = mongoose.Schema({
	name: {type: String, required: true},
	posts: [{type: Schema.ObjectId, ref: 'Post'}],
	active: Boolean
});

mongoose.model('Post', postSchema);
mongoose.model('User', userSchema);
mongoose.model('Category', categorySchema);

mongoose.connect("mongodb://localhost/redditClone", {useNewUrlParser: true, useUnifiedTopology: true});