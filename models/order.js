const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = mongoose.Schema({
    address1:String,
    city: String,
    state: String,
    pincode: String,
  });
  

//   mongoose.model('Address',AddressSchema)

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
    address: {
        type: AddressSchema,
        required: true,
      }
})

module.exports = mongoose.model('Order', OrdersSchema)