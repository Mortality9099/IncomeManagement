var express = require('express');
var router = express.Router();
const authMiddleWare = require('../middlewares/authentication');


router.get('/', authMiddleWare, function(req, res, next) {
  res.redirect('/expenses');
});

module.exports = router;
