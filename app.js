const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const index = require('./controllers/index');
const users = require('./controllers/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Add folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));


// Use dotenv to read .env file for user environment variables (aka secrets)
if(process.env.NODE_ENV != 'production'){
  require('dotenv').config();
}

// Add MongoDB Connection using Mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_STRING) // use environment variable for connection string
.then((res) => {
  console.log("Connected to mongoDB");
}).catch(() => {
  console.log("Connection to MongoDB Failed")
});

// Passport Auth configuration
const passport = require('passport');
const session = require('express-session');

app.use(session({
  secret: process.env.PASSPORT_SECRET,
  resave: true,
  saveUninitialized: false
}));

//start Passport
app.use(passport.initialize());
app.use(passport.session());

const User = require('./models/user');
passport.use(User.createStrategy());

// read / write session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport end

// ROUTES

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
