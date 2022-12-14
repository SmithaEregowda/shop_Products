const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String,
        required: true
    },
    productImg: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
     }
})

module.exports = mongoose.model('Product', ProductSchema)