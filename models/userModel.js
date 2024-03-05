const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
    },
    mobile: {
        type: Number
    },
    password: {
        type: String
    },
    is_admin:{
        type:String
    }
});

module.exports = mongoose.model("User", userSchema);