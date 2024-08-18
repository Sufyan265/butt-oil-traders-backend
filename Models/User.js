const mongoose = require('mongoose');
const { Schema } = mongoose;

// User schema for authentication
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model("user", UserSchema);
