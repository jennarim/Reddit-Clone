// let passport know what strategy you want to use as well as how to serialize and deserialize a user
const mongoose = require('mongoose'),
	  passport = require('passport'),
	  LocalStrategy = require('passport-local').Strategy,
	  User = mongoose.model('User');

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());