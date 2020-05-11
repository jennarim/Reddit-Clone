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
	score:     {type: Number, required: true},
	createdAt: {type: Date, required: [true, '{PATH} is required.']},
	comments:  [{type: Schema.ObjectId, ref: 'Comment'}]
});

const userSchema = Schema({
	username:   {type: String, required: [true, '{PATH} is required.'], minlength: [3, 'Should be more than 3 character'], maxlength: [30, 'Should be less than 30 characters'], validate: [vr.isAlphanumeric, 'Username must be alphanumeric']},
	// password:   {type: String, required: [true, '{PATH} is required.'], minlength: [3, 'Should be more than 3 character'], maxlength: [30, 'Should be less than 30 characters']},
	posts:      [{type: Schema.ObjectId, ref: 'Post'}],
	votedPosts: [{postId: {type: Schema.ObjectId, ref: 'Post'}, vote: {type: Number, min:-1, max:1}, _id: false}] 
});

const categorySchema = Schema({
	name: {type: String, required: [true, '{PATH} is required.'], minlength: [1, 'Should be more than 1 character'], maxlength: [30, 'Should be less than 30 characters']},
	posts: [{type: Schema.ObjectId, ref: 'Post'}]
});

const commentSchema = Schema({
	content:   {type: String, required: [true, '{PATH} is required.'], minlength: [1, 'Should be more than 1 character'], maxlength: [1000, 'Should be less than 1000 characters']},
	byUser:    {type: Schema.ObjectId, ref: 'User'},
	onPost:    {type: Schema.ObjectId, ref: 'Post'},
	createdAt: {type: Date, required: [true, '{PATH} is required.']}
});

userSchema.plugin(passportLocalMongoose);
postSchema.plugin(URLSlugs('title'));

mongoose.model('Post', postSchema);
mongoose.model('User', userSchema);
mongoose.model('Category', categorySchema);
mongoose.model('Comment', commentSchema);

mongoose.set('useFindAndModify', false);

let dbconf;

if (process.env.NODE_ENV === 'PRODUCTION') {
	dbconf = process.env.dbconf;
} else {
	// dbconf = "mongodb://localhost/redditClone";
	// dbconf = `mongodb+srv://${conf.username}:${conf.password}@redditclone-mnc1c.mongodb.net/redditClone?retryWrites=true&w=majority`;
	const fs = require('fs');
	const path = require('path');
	const fn = path.join(__dirname, 'config.json');

	const data = fs.readFileSync(fn);
	const conf = JSON.parse(data);

	dbconf = conf.dbconf;
}

console.log(dbconf);
mongoose.connect(dbconf, {useNewUrlParser: true, useUnifiedTopology: true})
.then(res => {
	console.log("DB connected1");
})
.catch(err => {
	console.log('error', err.message);
});