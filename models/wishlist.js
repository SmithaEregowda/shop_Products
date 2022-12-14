const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WishListSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
     },
    products: [
       { 
        productId:{
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    }
    ]
})

module.exports = mongoose.model('WishList', WishListSchema)