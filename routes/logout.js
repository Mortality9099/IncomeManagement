const User = require('../models/user')
var express = require('express');
var router = express.Router();
const authMiddleWare = require('../middlewares/authentication');

router.get('/', authMiddleWare, (req, res) => {
    
    req.session.destroy();
    delete req.current_user;
    delete current_user;
    
    res.render('login');
});

module.exports = router;