const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    MobileNumber: {
        type: Number,
        required: true
    },
    userType: {
        type: String,
        default: 'external user'
    },
    userRole: {
        type: String
    },
    Address: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpire: Date,
    imgurl: String,
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
})

module.exports = mongoose.model('User', UserSchema)