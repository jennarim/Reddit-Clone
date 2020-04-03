require('./db.js');
require('./auth.js');

const express = require('express'),
	  path = require('path'),
	  mongoose = require('mongoose'),
	  session = require('express-session'),
	  Handlebars = require('hbs'),
	  fs = require('fs'),
	  passport = require('passport');

const router = require('./routes/router.js');

const app = express();

const secretKey = fs.readFileSync(path.join(__dirname, 'session-key.txt'), 'utf8');

const sessionOptions = { 
    secret: secretKey, 
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

app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});

app.use((req, res, next) => {
	Category.find({}, (err, categories) => {
		res.locals.categories = categories;
		next();	
	});
});

// const postVar = Handlebars.compile(''+);
Handlebars.registerPartial('postPartial', fs.readFileSync(path.join(__dirname, 'views/partials/postPartial.hbs'), 'utf8'));
// Handlebars.registerPartial('partialTemplate', '{{language}} is {{adjective}}');
console.log(Handlebars.partials);

app.use('/', router);

app.listen(3000);