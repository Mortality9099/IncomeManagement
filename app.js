var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const crypto = require('crypto');
const session = require('express-session');

function generateSecretKey() {
  const secretKeyLength = 32; // Recommended key length (in bytes)
  const buffer = crypto.randomBytes(secretKeyLength);
  return buffer.toString('base64');
}



const mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var expenseRouter = require('./routes/expenses');
var loginRouter = require('./routes/login');

const dbUrl = 'mongodb://127.0.0.1:27017/test';
const conn = mongoose.connect(dbUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));


var app = express();

app.use(session({
  secret: generateSecretKey() , // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS in production
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter); 
app.use('/login', loginRouter); 
app.use('/expenses', expenseRouter); 


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
