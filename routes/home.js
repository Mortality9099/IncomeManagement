var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/user/login');
  }
  else {
    res.redirect('/expense/list');
  }
});

module.exports = router;