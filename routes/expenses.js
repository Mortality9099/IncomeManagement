var express = require('express');
var router = express.Router();
const authMiddleWare = require('../middlewares/authentication');
const Transaction = require('../models/transaction')

/* GET home page. */

router.get('/', function(req, res, next) {

  res.redirect('/expenses/list');
});

router.get('/list', authMiddleWare, async function(req, res, next) {

  user_transactions = await Transaction.find({user : req.current_user}).sort('-date').exec();
  console.log(req.session.successMessage);
  res.render('list_expenses', { title: 'Expenses List',  successMessage: req.session.successMessage, expense_list : user_transactions, errorMessage: req.session.errorMessage});
});

router.get('/add', authMiddleWare, function(req, res, next) {

  user_categories = req.current_user.categories;
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
  
    req.current_user.total_balance += expense.type == "income" ? expense.amount : -expense.amount;
    expense.save();
    req.current_user.save();
    req.session.successMessage = "Expense Added Sucessfully!";  
  }catch {
    req.session.errorMessage = "Problem Occured Adding Expense!";
  }

  res.redirect('/expenses/list');
});

router.get('/delete/:id', authMiddleWare, async function(req, res, next) {

  try {

    expense = await Transaction.findOne({user: req.current_user, _id : req.params.id}).exec();
    req.current_user.total_balance -= expense.type == "income" ? expense.amount : -expense.amount;   
    req.current_user.save();   
    await Transaction.deleteOne({user: req.current_user, _id : req.params.id}).exec();
    req.session.successMessage = "Expense Deleted Sucessfully!";  
  } catch {
    req.session.errorMessage = "Problem Occured Deleting Expense!";
  }

  res.redirect('/expenses/list');
});

router.get('/edit/:id', authMiddleWare, async function(req, res, next) {

  expense = await Transaction.findOne({user: req.current_user, _id : req.params.id}).exec();
  user_categories = req.current_user.categories;

  if(expense)
    res.render('edit_expense', { title: 'Edit Expense', user_categories: user_categories, expense: expense});
  else
    res.redirect('/expenses/list');
});

router.post('/edit/:id', authMiddleWare, async function(req, res, next) {

  console.log(req.current_user);
  expense = await Transaction.findOne({user: req.current_user, _id : req.params.id}).exec();
  if(expense){
      req.current_user.total_balance -= expense.type == "income" ? expense.amount : -expense.amount;

      expense.name = req.body.name; 
      expense.amount = req.body.amount;
      expense.category = req.body.category;
      expense.type  = req.body.type;

      req.current_user.total_balance += expense.type == "income" ? expense.amount : -expense.amount;

      expense.save();
      req.current_user.save();   
      req.session.successMessage = "Expense Edited Sucessfully!";  
  }else {
    req.session.errorMessage = "Problem Occured Editing Expense!";
  }

  res.redirect('/expenses/list');
});



module.exports = router;
