const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = mongoose.Schema({
    city: String,
    street: String,
    houseNumber: String,
  });
  const PaymentSchema = mongoose.Schema({
    paymentType: String,
    paymentinrs: String,
    paymentdetails:String
  });

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
        type:AddressSchema
    },
    payment:{
        type:PaymentSchema
    }
})

module.exports = mongoose.model('Order', OrdersSchema)