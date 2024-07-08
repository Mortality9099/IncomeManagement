const User = require('../models/user');
const Transaction = require('../models/transaction');

const authMiddleWare = async (req, res, next) => {

    if (!req.session.userId)
        return res.redirect('/login');

    current_user = await User.findOne({ _id : req.session.userId }).exec();

    if(!current_user){
        delete req.current_user;
        return res.redirect('/login');
    }
    else
        req.current_user = current_user;

    next();
};

module.exports = authMiddleWare;