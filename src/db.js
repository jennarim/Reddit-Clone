const mongoose = require('mongoose'),
	  passportLocalMongoose = require('passport-local-mongoose'),
	  URLSlugs = require('mongoose-url-slugs');
// const URLSlugs = require('mongoose-url-slugs');
const Schema = mongoose.Schema;

const postSchema = Schema({
	category:  {type: Schema.Types.ObjectId, ref: 'Category', required: true},
	title: 	   {type: String, required: true},
	type: 	   {type: String, required: true},
	body: 	   {type: String, required: true},
	author:    {type: Schema.Types.ObjectId, ref: 'User', required: true},
	createdAt: {type: Date, required: true},
});

const userSchema = Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	posts:    [{type: Schema.ObjectId, ref: 'Post'}]
});

const categorySchema = Schema({
	name: {type: String, required: true},
	posts: [{type: Schema.ObjectId, ref: 'Post'}],
	active: Boolean
});

// postSchema.plugin(URLSlugs());
userSchema.plugin(passportLocalMongoose);
postSchema.plugin(URLSlugs('title'));

mongoose.model('Post', postSchema);
mongoose.model('User', userSchema);
mongoose.model('Category', categorySchema);

mongoose.connect("mongodb://localhost/redditClone", {useNewUrlParser: true, useUnifiedTopology: true});