const User = require('../models/user')
var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    
    if (req.session.userId) {
        return res.redirect('/');
    }

    res.render('login');
});

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user || user.password != password) {
      return res.status(401).render('login', { errorMessage: 'Invalid credentials' });
    }

    req.session.userId = user._id; // Store user ID in session
    res.redirect('/'); // Redirect to home page after successful login
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
