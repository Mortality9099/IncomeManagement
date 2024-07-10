const asyncHandler = require("express-async-handler");
const Transaction = require('../models/transaction')

exports.index = asyncHandler(async (req, res, next) => {
  res.redirect('/expense/list');
})

exports.list = asyncHandler(async function(req, res, next) {
  var tot_income = 0;
  var tot_expenditure = 0;
  user_transactions = await Transaction.find({user : req.current_user}).sort('-date').exec();
  user_transactions.forEach(tr => {
    if (tr.type === 'income') {
      tot_income += tr.amount;
    } else if (tr.type === 'expenditure') {
      tot_expenditure += tr.amount;
    }
  })
  res.render('list_expense', { title: 'Expenses List',  successMessage: req.session.successMessage, 
    expense_list : user_transactions, total_income: tot_income, total_expenditure: tot_expenditure, errorMessage: req.session.errorMessage});
})

exports.list_post = asyncHandler(async function(req, res, next) {
  console.log(req.body);
  const query = {};
  if (req.body.fromDate){
    query.date = query.date || {};
    query.date.$gte = new Date(req.body.fromDate);
  }
  if (req.body.toDate){
    query.date = query.date || {};
    query.date.$lte = new Date(req.body.toDate);
  }
  if (req.body.category){
    query.category = req.body.category
  }
  if (req.body.transactionType){
    query.type = req.body.transactionType;
  }
  var tot_income = 0;
  var tot_expenditure = 0;
  user_transactions = await Transaction.find(query).sort('-date').exec();
  user_transactions.forEach(tr => {
    if (tr.type === 'income') {
      tot_income += tr.amount;
    } else if (tr.type === 'expenditure') {
      tot_expenditure += tr.amount;
    }
  })
  console.log(query)
  res.render('list_expense', { title: 'Expenses List',  successMessage: req.session.successMessage, fromDate: req.body.fromDate, toDate: req.body.toDate,
    category: query.category, transactionType: query.type, expense_list : user_transactions, total_income: tot_income, 
    total_expenditure: tot_expenditure, errorMessage: req.session.errorMessage});
})

exports.add_get = asyncHandler(async (req, res, next) => {
  user_categories = req.current_user.categories;
  res.render('add_expense', { title: 'Add Expense', user_categories: user_categories});
})

exports.add_post = asyncHandler(async (req, res, next) => {
  
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
  } catch {
    req.session.errorMessage = "Problem Occured Adding Expense!";
  }

  res.redirect('/expense/list');
})

exports.delete = asyncHandler(async (req, res, next) => {
  
  try {

    expense = await Transaction.findOne({user: req.current_user, _id : req.params.id}).exec();
    req.current_user.total_balance -= expense.type == "income" ? expense.amount : -expense.amount;   
    req.current_user.save();   
    await Transaction.deleteOne({user: req.current_user, _id : req.params.id}).exec();
    req.session.successMessage = "Expense Deleted Sucessfully!";  
  } catch {
    req.session.errorMessage = "Problem Occured Deleting Expense!";
  }

  res.redirect('/expense/list');
});

exports.edit_get = asyncHandler(async (req, res, next) => {
  
  expense = await Transaction.findOne({user: req.current_user, _id : req.params.id}).exec();
  user_categories = req.current_user.categories;

  if(expense)
    res.render('edit_expense', { title: 'Edit Expense', user_categories: user_categories, expense: expense});
  else
    res.redirect('/expense/list');
})

exports.edit_post = asyncHandler(async (req, res, next) => {
  
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

  res.redirect('/expense/list');
})