const ProdReqModel = require('../models/productReqs');
const Order=require('../models/order')

exports.getAllRequest = async (req, res, next) => {
    try {
        const AllProductReqs = await ProdReqModel.find({});

        if (!AllProductReqs) {
            const error = new Error('Product Requests Not Found');
            throw error;
        }
        res.status(200).json({
            message: "Product Requests Reterived Successfully",
            productReqs: AllProductReqs
        })

    } catch (err) {
        next(err)
    }
}

exports.getRequestByUser = async (req, res, next) => {
    try {
        let userId = req.params.userId;

        if (!userId) {
            const error = new Error('please provide vaild userId');
            throw error;
        }
        const productByuser = await ProdReqModel.find({ ProdUserId: userId });

        if (!productByuser) {
            const error = new Error('Product Requests Not Found');
            throw error;
        }
        res.status(200).json({
            message: "Product Requests Reterived Successfully",
            productReqs: productByuser
        })

    } catch (err) {
        next(err)
    }
}

exports.ProcessReq = async (req, res, next) => {
    try {
        const mode = req.body.mode;
        const orderId = req.body.orderId;
        const reQusetedProd = req.body.reQusetedProd;
        const DeliverySatus = req.body.DeliverySatus;
        const requestId = req.body.requestId;

        let updatedDelivery;

        if (DeliverySatus === "Ordered" && mode === "accept") {
            updatedDelivery = "Shipped"
        }

        if (DeliverySatus === "Shipped" && mode === "accept") {
            updatedDelivery = "Delivered"
        }
        if(mode==="reject"){
            updatedDelivery="Canceled"
        }

        const updatedRequestByProduct = await ProdReqModel
            .findByIdAndUpdate(
                requestId,
                { DeliverySatus: updatedDelivery },
                { new: true }
            );

        if (!updatedRequestByProduct) {
            const error = new Error('Request Not Found');
            throw error;
        }

        const orderOfProduct=await Order.findById(orderId);
        if (!orderOfProduct) {
            const error = new Error('order Not Found');
            throw error;
        }
        if(orderOfProduct.products?.length>0){
           const prodItemIndex= orderOfProduct.products.findIndex(prod=>prod?._id.toString()===reQusetedProd);
           const RequestedProduct=orderOfProduct.products[prodItemIndex];
           RequestedProduct.isDeliverd=updatedDelivery;
           orderOfProduct.products[prodItemIndex]=RequestedProduct;
           const updatedOrderandReq = await orderOfProduct.save();
           console.log(updatedOrderandReq);

           res.status(201).json({
               message: "request updated successfully",
               request: updatedRequestByProduct
           })
        }
    } catch (err) {
        next(err)
    }

}