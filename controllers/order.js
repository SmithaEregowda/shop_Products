const { validationResult } = require('express-validator')
const Order = require('../models/order')
const Product = require('../models/product')
const ProductReqs=require('../models/productReqs')
const { default: mongoose } = require('mongoose')

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
          let address={
            address1:req?.body?.address1,
            city:req?.body?.city,
            state:req?.body?.state,
            pincode:req?.body?.pincode
        }
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
            payment: PayMentMode,
            isDeliverd: isDeliverd,
            address:address
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
            status:200,
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
        const ordersByUser=await Order.find({userId:userId}).sort({_id:-1});
        if(!ordersByUser){
            const error = new Error('orders not found for the usr');
            error.statusCode = 404;
            throw error 
        }
        res.status(200).json({
            status:200,
            message: "ordered fetched successfully",
            orderDetails: ordersByUser
        })

    } catch (err) {
        next(err)
    }
}

exports.getOrderById=async (req,res,next)=>{
    try{
        
        let orderId = req.params.orderId;
        if(!orderId) {
            const error = new Error('please provide orderId');
            error.statusCode = 404;
            throw error
        }

        const orderByIddata=await Order.findById({_id:orderId});
        
        if(!orderByIddata){
            const error = new Error('orders not found for the given orderID');
            error.statusCode = 404;
            throw error 
        }
        let orderproducts=orderByIddata?.products;
        let productIds=orderproducts?.map((item)=>item?._id)
        const listofproducts=await Product.find({_id: {$in: productIds}});
        res.status(200).json({
            status:200,
            message: "ordered fetched successfully",
            order: orderByIddata,
            orderedproducts:listofproducts
        });

    }catch (err){
        next(err)
    }
}

exports.UpdateOrder = async (req, res, next) => {
    // const errors=validationResult(req);
    const orderId = req.params.orderId;
    try {
        let orderobj = await Order.findById(orderId);
        if(!orderobj){
            const error = new Error('order not found');
            error.statusCode = 400;
            throw error
        }
        let productobjs=orderobj?.products

        let cancelproductIndex=orderobj?.products?.findIndex((prd)=>prd._id.toString()===req.body.prodId);

        if(cancelproductIndex===-1){
            const error = new Error('Invalid product has been sent');
            error.statusCode = 400;
            throw error 
        }

        let cancelprodObj=productobjs[cancelproductIndex];
        cancelprodObj["isDeliverd"]="Canceled";
        productobjs[cancelproductIndex]=cancelprodObj;
        orderobj.products=productobjs;

         const orderUpdatedObj = await Order.findByIdAndUpdate(
                orderId,
                {...orderobj},
                { new: true }
            );
        
        if (!orderUpdatedObj) {
            const error = new Error('cancel order Failed');
            error.statusCode = 400;
            throw error
        }
        res.status(200).json({
            status:200,
            message: 'product updated successfully',
            order: orderUpdatedObj
        })
    } catch (err) {
        next(err)
    }
}