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
            default: "Ordered"
        },
    }
    ],
    totalPrice:Number,
    Address:{
        address1:String,
        address2:String,
        city:String,
        state:String,
        pincode:String
    },
    payment:Object
})

module.exports = mongoose.model('Order', OrdersSchema)