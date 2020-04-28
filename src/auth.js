/*
	Credit to Professor Versoza's slides on Authentication
	https://cs.nyu.edu/courses/spring20/CSCI-UA.0480-008/_site/slides/16/auth.html?print-pdf#/1
*/

// let passport know what strategy you want to use as well as how to serialize and deserialize a user
const mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('User');

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());