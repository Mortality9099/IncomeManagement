var express = require('express');
var router = express.Router();
const authMiddleWare = require('../middlewares/authentication');
const controller = require('../controllers/userController')

router.get('/login', controller.login_get);

router.post('/login', controller.login_post);

router.get('/logout', authMiddleWare, controller.logout);

router.get('/signup', controller.signup_get);

router.post('/signup', controller.signup_post);

module.exports = router;