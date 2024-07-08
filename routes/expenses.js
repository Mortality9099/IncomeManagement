var express = require('express');
var router = express.Router();
const authMiddleWare = require('../middlewares/authentication');
const Transaction = require('../models/transaction')

/* GET home page. */
router.get('/list', authMiddleWare, async function(req, res, next) {

  user_transactions = await Transaction.find({user : req.current_user}).exec();
  res.render('list_expenses', { title: 'Expenses List', expense_list : user_transactions});
});

router.get('/add', authMiddleWare, async function(req, res, next) {

  user_transactions = await Transaction.find({user : req.current_user}).exec();
  
  res.render('add_expense', { title: 'Add Expense'});
});


module.exports = router;
