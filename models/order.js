const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrdersSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
     },
    products:[
       { 
        product:{
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity:Number,
        isDeliverd: {
            type: String,
            default: "ToDo"
        },
    }
    ],
    totalPrice:Number,
    Address:String,
    PayMentMode:String
})

module.exports = mongoose.model('Order', OrdersSchema)