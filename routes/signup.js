const User = require('../models/user')
var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    
    if (req.session.userId) {
        return res.redirect('/');
    }

    res.render('signup');
});

router.post('/', async (req, res) => {
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
    res.redirect('/login'); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
