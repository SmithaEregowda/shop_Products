const { validationResult } = require('express-validator')
const Order = require('../models/order')
const Product = require('../models/product')
const ProductReqs=require('../models/productReqs')

exports.postOrder = async (req, res, next) => {
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation Failed');
            error.statusCode = 422;
            error.data = errors.array()
            throw error
        }

        let userId = req.body.userId;
        let prodId = req.body.prodId;
        let totalPrice = req.body?.totalPrice;
        let Address = req.body?.Address;
        let PayMentMode = req.body?.PayMentMode;
        let isDeliverd = req.body?.isDeliverd;
        let isfromcart = req.body.isfromcart;
        let product;
        if (!isfromcart) {
            product = await Product.findById(prodId);
            if (!product) {
                const error = new Error('product not found');
                error.statusCode = 404;
                throw error
            }
        } else {
            
            product = await Product.find({
                '_id': {
                    $in: req.body.products
                }
            })
           // console.log(product)
        }
        
        const createorder = new Order({
            userId: userId,
            products: product,
            totalPrice: totalPrice,
            Address: Address,
            payment: PayMentMode,
            isDeliverd: isDeliverd
        })

        const newOrder = await createorder.save();

        if (!newOrder) {
            const error = new Error('not able to make order,please try again');
            error.statusCode = 400;
            throw error
        }
        if(product?.userId){
            let requesterUserId=req.body.userId;
            let reQusetedProd=product?._id;
            let ProdUserId=product?.userId;
            let DeliverySatus="Ordered"
            let orderId=newOrder?._id;
            const reqObj=new ProductReqs({
                requesterUserId,
                reQusetedProd,
                ProdUserId,
                DeliverySatus,
                orderId
            })
            const createdReq= await reqObj.save();
            if(createdReq){
                console.log('Request of Order sent successfully!!')
            }else{
                console.log('request not sent')
            }
           
        }

        res.status(201).json({
            message: "ordered successfully",
            orderDetails: newOrder
        })

    } catch (err) {
        next(err)
    }

}

exports.getOrderByUser = async (req, res, next) => {

    try {
        let userId = req.params.userId;

        if (!userId) {
            const error = new Error('please provide userId');
            error.statusCode = 404;
            throw error
        }
        const ordersByUser=await Order.find({userId:userId});
        if(!ordersByUser){
            const error = new Error('orders not found for the usr');
            error.statusCode = 404;
            throw error 
        }
        res.status(200).json({
            message: "ordered fetched successfully",
            orderDetails: ordersByUser
        })

    } catch (err) {
        next(err)
    }
}