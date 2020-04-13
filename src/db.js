const mongoose = require('mongoose'),
	  passportLocalMongoose = require('passport-local-mongoose'),
	  URLSlugs = require('mongoose-url-slugs');

const Schema = mongoose.Schema;

const enumOptions = {values: ['text', 'img'], message:'{VALUE} is not a valid post type.'};
const postSchema = Schema({
	category:  {type: Schema.Types.ObjectId, ref: 'Category', required: [true, '{PATH} is required.']},
	title: 	   {type: String, required: [true, '{PATH} is required.']},
	type: 	   {type: String, required: [true, '{PATH} is required.'], enum: enumOptions},
	body: 	   {type: String, required: [true, '{PATH} is required.']},
	author:    {type: Schema.Types.ObjectId, ref: 'User', required: [true, '{PATH} is required.']},
	createdAt: {type: Date, required: [true, '{PATH} is required.']}
});

const userSchema = Schema({
	username: {type: String, required: [true, '{PATH} is required.']},
	password: {type: String, required: [true, '{PATH} is required.']},
	posts:    [{type: Schema.ObjectId, ref: 'Post'}]
});

const categorySchema = Schema({
	name: {type: String, required: [true, '{PATH} is required.']},
	posts: [{type: Schema.ObjectId, ref: 'Post'}],
	active: Boolean
});

userSchema.plugin(passportLocalMongoose);
postSchema.plugin(URLSlugs('title'));

mongoose.model('Post', postSchema);
mongoose.model('User', userSchema);
mongoose.model('Category', categorySchema);

mongoose.connect("mongodb://localhost/redditClone", {useNewUrlParser: true, useUnifiedTopology: true});