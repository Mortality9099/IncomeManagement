const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    total_balance: {type: Number , default: 0.0},
    categories: {type: [String]} 
});

const User = mongoose.model('User', UserSchema);
module.exports = User;