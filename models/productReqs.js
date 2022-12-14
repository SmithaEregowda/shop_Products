const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductReq = new Schema({
    requesterUserId:{
        type:Schema.Types.ObjectId,
        ref:'User'
     },
    reQusetedProd:{ 
            type: Schema.Types.ObjectId,
            ref: 'Product' 
    },
    orderId:{
        type:Schema.Types.ObjectId,
        ref:'Order'
     },
    DeliverySatus:String,
    ProdUserId:String
})

module.exports = mongoose.model('ProductReq', ProductReq)