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

// Make list of all categories available to templates
app.use((req, res, next) => {
	Category.find({}, (err, categories) => {
		if (err) {
			handeError();
		} else {
			res.locals.categories = categories;
		}
		next();	
	});
});

// Route handling
app.use('/', require('./routes/home.js'));
app.use('/', require('./routes/create.js'));
app.use('/', require('./routes/loginRegister.js'));
app.use('/', require('./routes/category.js'));

app.listen(3000);