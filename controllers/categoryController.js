const asyncHandler = require("express-async-handler");
const Category = require('../models/category')

exports.index = asyncHandler(async (req, res, next) => {
  res.redirect('/category/list');
})

exports.list = asyncHandler(async function(req, res, next) {
  user_categories = await Category.find({user : req.current_user}).exec();

  res.render('list_category', { title: 'categories List',  successMessage: req.session.successMessage, 
    category_list : user_categories, errorMessage: req.session.errorMessage});
})

exports.add_get = asyncHandler(async (req, res, next) => {
  user_categories = req.current_user.categories;
  res.render('add_category', { title: 'Add category', user_categories: user_categories});
})

exports.add_post = asyncHandler(async (req, res, next) => {
  
  try {
    category = new Category;
    category.name = req.body.name; 
    category.user = req.current_user;
  
    category.save();
    req.session.successMessage = "category Added Sucessfully!";  
  } catch {
    req.session.errorMessage = "Problem Occured Adding category!";
  }

  res.redirect('/category/list');
})

exports.delete = asyncHandler(async (req, res, next) => {
  
  try {
    
    category = await Category.findOne({user: req.current_user, _id : req.params.id}).exec();
    const transactionsWithCategory = await Transaction.find({ category: categoryId });
    if (transactionsWithCategory.length > 0){
      req.session.errorMessage = "Cant Delete Category";
    }
    else {
      await Category.deleteOne({user: req.current_user, _id : req.params.id}).exec();
      req.session.successMessage = "Category Deleted Sucessfully!";  
    }
    
  } catch {
    req.session.errorMessage = "Problem Occured Deleting category!";
  }

  res.redirect('/category/list');
});

exports.edit_get = asyncHandler(async (req, res, next) => {
  
  category = await Category.findOne({user: req.current_user, _id : req.params.id}).exec();
  user_categories = req.current_user.categories;

  if(category)
    res.render('edit_category', { title: 'Edit category', user_categories: user_categories, category: category});
  else
    res.redirect('/category/list');
})

exports.edit_post = asyncHandler(async (req, res, next) => {
  
  category = await Category.findOne({user: req.current_user, _id : req.params.id}).exec();
  if(category){
      category.name = req.body.name; 

      category.save();   
      req.session.successMessage = "Category Edited Sucessfully!";  
  }else {
    req.session.errorMessage = "Problem Occured Editing category!";
  }

  res.redirect('/category/list');
})