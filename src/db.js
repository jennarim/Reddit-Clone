const mongoose = require('mongoose'),
	  passportLocalMongoose = require('passport-local-mongoose'),
	  URLSlugs = require('mongoose-url-slugs'),
	  vr = require('validator');

const Schema = mongoose.Schema;

const enumOptions = {values: ['text', 'image'], message:'{VALUE} is not a valid post type.'};
const postSchema = Schema({
	category:  {type: Schema.Types.ObjectId, ref: 'Category', required: [true, '{PATH} is required.']},
	title: 	   {type: String, required: [true, '{PATH} is required.'], minlength: [1, 'Should be more than 1 character'], maxlength: [200, 'Should be less than 200 characters']},
	type: 	   {type: String, required: [true, '{PATH} is required.'], enum: [enumOptions, 'Value should be either text or img']},
	body: 	   {type: String, required: [true, '{PATH} is required.'], minlength: [1, 'Should be more than 1 character'], maxlength: [1000, 'Should be less than 1000 characters']},
	author:    {type: Schema.Types.ObjectId, ref: 'User', required: [true, '{PATH} is required.']},
	createdAt: {type: Date, required: [true, '{PATH} is required.']}
});

const userSchema = Schema({
	username: {type: String, required: [true, '{PATH} is required.'], minlength: [1, 'Should be more than 1 character'], maxlength: [30, 'Should be less than 30 characters']},
	password: {type: String, required: [true, '{PATH} is required.'], minlength: [1, 'Should be more than 1 character'], maxlength: [30, 'Should be less than 30 characters']},
	posts:    [{type: Schema.ObjectId, ref: 'Post'}]
});

const categorySchema = Schema({
	name: {type: String, required: [true, '{PATH} is required.'], minlength: [1, 'Should be more than 1 character'], maxlength: [30, 'Should be less than 30 characters']},
	posts: [{type: Schema.ObjectId, ref: 'Post'}]
});

userSchema.plugin(passportLocalMongoose);
postSchema.plugin(URLSlugs('title'));

mongoose.model('Post', postSchema);
mongoose.model('User', userSchema);
mongoose.model('Category', categorySchema);

mongoose.connect("mongodb://localhost/redditClone", {useNewUrlParser: true, useUnifiedTopology: true});