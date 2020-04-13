require('./db.js');
require('./auth.js');

const express = require('express'),
	  path = require('path'),
	  mongoose = require('mongoose'),
	  session = require('express-session'),
	  hbs = require('hbs'),
	  // Handlebars = require('Handlebars'),
	  fs = require('fs'),
	  passport = require('passport');

const config = require('./config.json');
const router = require('./routes/router.js');

const app = express();

const sessionOptions = { 
    secret: config.secret, 
    saveUninitialized: true, 
    resave: true 
};

app.set('view engine', 'hbs');
app.use(session(sessionOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());

const Category = mongoose.model('Category');
const Post = mongoose.model('Post');

const partial = fs.readFileSync(path.join(__dirname, 'views/partials/postPartial.hbs'), 'utf8');

hbs.registerPartial('postPartial', partial);
console.log(hbs.partials);

function handleError(err) {
	res.render('error');
};

// Make username available to templates
app.use((req, res, next) => {
	if (req.user) {
		res.locals.username = req.user.username;
	} else {
		res.locals.username = undefined;
	}
	next();
});

app.use((req, res, next) => {
	Category.find({}, (err, categories) => {
		res.locals.categories = categories;
		next();	
	});
});

// app.use((req, res, next) => {
// 	Post.find({}, (err, posts) => {
// 		console.log("POsts before:", posts);
// 		Post.find().populate('category', 'name').exec((err, posts) => {
// 			console.log("posts after category populate:", posts);
// 			next();
// 		});
// 	})
// });

// app.use((req, res, next) => {
// 	Post.find({}, (err, posts) => {
// 		console.log("posts next middle:", posts);
// 		next();
// 	});
// });



// const postVar = Handlebars.compile(''+);
// Handlebars.registerPartial('partialTemplate', '{{language}} is {{adjective}}');
// console.log(Handlebars.partials);

app.use('/', router);

app.listen(3000);