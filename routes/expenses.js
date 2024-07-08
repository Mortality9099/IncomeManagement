var express = require('express');
var router = express.Router();
const authMiddleWare = require('../middlewares/authentication');
const Transaction = require('../models/transaction')

/* GET home page. */
router.get('/list', authMiddleWare, async function(req, res, next) {

  user_transactions = await Transaction.find({user : req.current_user}).exec();
  res.render('list_expenses', { title: 'Expenses List', expense_list : user_transactions});
});

router.get('/add', authMiddleWare, function(req, res, next) {

  user_categories = current_user.categories;
  res.render('add_expense', { title: 'Add Expense', user_categories: user_categories});
});

router.post('/add', authMiddleWare, function(req, res, next) {

  try {
    expense = new Transaction;
    expense.name = req.body.name; 
    expense.amount = req.body.amount; 
    expense.type = req.body.type; 
    expense.category = req.body.category; 
    expense.user = req.current_user; 
    expense.save();
  }catch({}) {
      //TODO Catch And Error 
  }

  res.redirect('/expenses/list');
});

router.get('/delete/:id', authMiddleWare, async function(req, res, next) {

  await Transaction.deleteOne({user: req.current_user, _id : req.params.id}).exec();
  //TODO ERROR
  res.redirect('/expenses/list');
});


module.exports = router;
