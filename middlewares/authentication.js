const User = require('./models/User')

const basicAuth = require('express-basic-auth'); 

const authenticate = async (req, res, next) => {
  const user = basicAuth(req, res);

  if (!user || !user.username || !user.password) {
    return res.status(401).send('Unauthorized: Login required');
  }

  try {
    const foundUser = await User.findOne({ username: user.username }); 

    if (!foundUser || !foundUser.comparePassword(user.password)) { 
      return res.status(401).send('Unauthorized: Invalid credentials');
    }

    req.user = foundUser; 
    next();
  } catch (error) {
    console.error(error); 
    res.status(500).send('Internal Server Error');
  }
};

module.exports = authenticate;