const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    nombres: String,
    apellidos: String,
    email:{
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
module.exports = User = mongoose.model('user', UserSchema);