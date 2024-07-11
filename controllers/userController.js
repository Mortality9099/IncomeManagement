const asyncHandler = require("express-async-handler");
var User = require("../models/user")

exports.login_get = asyncHandler(async (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/');
  }

  delete req.current_user;
  delete current_user;

  res.render('login', {successMessage: req.session.successMessage});
});

exports.login_post = asyncHandler(async (req, res, next) => {
  const { user_login, password } = req.body;

  try {
    const user = await User.findOne({$or: [{'email': user_login}, {'username': user_login}]});

    if (!user || user.password != password) {
      return res.status(401).render('login', { errorMessage: 'Invalid credentials'});
    }

    req.session.userId = user._id; // Store user ID in session
    res.redirect('/'); // Redirect to home page after successful login
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})

exports.logout = asyncHandler(async (req, res, next) => {
  req.session.destroy();
  delete req.current_user;
  delete current_user;
  
  res.render('login');
})

exports.signup_get = asyncHandler(async (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/user/signup');
  }
  delete req.current_user;
  res.render('signup');
})

exports.signup_post = asyncHandler(async (req, res, next) => {
  const { username, email, password, } = req.body;

  try {
    const user = await User.findOne({$or: [{'email': email}, {'username': username}]}).exec();

    if (user)
      return res.status(401).render('signup', { errorMessage: 'User With This Email or Username Already Exists!' });

    new_user = new User;
    new_user.username = username;
    new_user.email = email;
    new_user.password = password;
    new_user.save();
    
    req.session.successMessage = "Sign Up Was Successful!"
    res.redirect('/user/login'); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})