const validationResult = require('express-validator');
const Product = require('../models/product')
const User = require('../models/user')
const path = require('path');
const fs = require('fs');
const Cart = require('../models/cart');

exports.getAllProducts = async (req, res, next) => {
    try {
        let limit = req.query.limit ? req.query.limit : 10;
        let pageNo = req.query.pageNo;
        let totalCount = await Product.find().countDocuments();
        let offset = pageNo ? (pageNo - 1) * limit : 0
        const AllProducts = await Product.find().skip(offset).limit(limit)
        if (!AllProducts) {
            const error = new Error('not able to retrive products');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({
            status:200,
            products: AllProducts,
            pagination: {
                offset,
                limit,
                totalCount
            }
        })
    } catch (err) {
        next(err);
    }
}


exports.getProductById = async (req, res, next) => {
    const prodId = req.params.prodId;
    try {
        if (!prodId) {
            const error = new Error('please provide Valid product Id');
            error.statusCode = 400;
            throw error;
        }
        const product = await Product.findById(prodId);
        if (!product) {
            const error = new Error('product not fetched successfully');
            error.statusCode = 400;
            throw error;
        }

        res.status(200).json({
            status:200,
            message: 'product retreived successfully',
            product
        })

    } catch (err) {
        next(err)
    }
}

exports.getProductByUserId = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        let limit = req.query.limit ? req.query.limit : 10;
        let pageNo = req.query.pageNo;
        let totalCount = await Product.find().countDocuments();
        let offset = pageNo ? (pageNo - 1) * limit : 0
        if (!userId) {
            const error = new Error('please provide Valid user Id');
            error.statusCode = 400;
            throw error;
        }
        const products= await Product.find({userId:userId}).skip(offset).limit(limit);

        if (!products) {
            const error = new Error('products not fetched successfully');
            error.statusCode = 400;
            throw error;
        }

        res.status(200).json({
            status:200,
            message: 'products retreived successfully',
            products,
            pagination: {
                offset,
                limit,
                totalCount
            }
        })

    } catch (err) {
        next(err)
    }
}

exports.AddProducts = async (req, res, next) => {
    // const errors=validationResult(req);
    try {
        let imageUrl = '';
        if (req.file) {
            imageUrl = req.file.path.replace("\\", "/");
        }
        if (!imageUrl) {
            const error = new Error('product Image Not Found');
            error.statusCode = 400;
            throw error;
        }
        // if (!errors.isEmpty()) {
        //     const error = new Error('Validation Failed');
        //     error.statusCode = 422;
        //     error.data = errors.array()
        //     throw error
        // }
        const product = new Product({
            ...req.body,
            productImg: imageUrl,
            userId: req.userId
        });
        const createdProduct = await product.save();
        if (!createdProduct) {
            const error = new Error('product creation Failed');
            error.statusCode = 400;
            throw error
        }
        const productUser = await User.findById(req.userId)
        if (!productUser) {
            const error = new Error('user not found');
            error.statusCode = 400;
            throw error
        }
        productUser.products.push(createdProduct);
        productUser.save();

        res.status(200).json({
            status:200,
            message: 'product created successfully',
            product: createdProduct
        })
    } catch (err) {
        next(err)
    }
}
exports.updateProduct = async (req, res, next) => {
    // const errors=validationResult(req);
    const prodId = req.params.prodId;
    try {
        let imageUrl = '';
        if (req.file) {
            imageUrl = req.file.path.replace("\\", "/");
        }

        let product = await Product.findById(prodId);
        if (product) {
            if (imageUrl !== product?.productImg) {
                clearImage(product?.productImg)
            }
        }
        let updatedProduct;
        if (imageUrl) {
            updatedProduct = await Product.findByIdAndUpdate(
                prodId,
                { ...req.body, productImg: imageUrl },
                { new: true }
            );
        } else {
            updatedProduct = await Product.findByIdAndUpdate(
                prodId,
                { ...req.body },
                { new: true }
            );
        }
        if (!updatedProduct) {
            const error = new Error('product update Failed');
            error.statusCode = 400;
            throw error
        }
        res.status(200).json({
            status:200,
            message: 'product updated successfully',
            product: updatedProduct
        })
    } catch (err) {
        next(err)
    }
}
exports.deleteProductById = async (req, res, next) => {
    const prodId = req.params.prodId;
    try {
        if (!prodId) {
            const error = new Error('please provide Valid product Id');
            error.statusCode = 400;
            throw error;
        }
        const removeProdFromUser = await User.updateOne(
            { _id: req.userId },
            {
                $pull: { products: prodId }
            })
        const removedCartProducts = await Cart.updateMany(
            {},
            { $pull: { products: { product: prodId } } })
            if (!removeProdFromUser || !removedCartProducts ) {
                const error = new Error('not able to delete products,Refrence Error');
                error.statusCode = 400;
                throw error;
            }

        const product = await Product.findByIdAndRemove(prodId);
        if (!product) {
            const error = new Error('product not found');
            error.statusCode = 400;
            throw error;
        }
        
        clearImage(product?.productImg)
        res.status(200).json({
            status:200,
            message: 'product removed successfully',
            _id: product._id
        })

    } catch (err) {
        next(err)
    }
}

const clearImage = (filepath) => {
    filepath = path.join(__dirname, '..', filepath);
    fs.unlink(filepath, err => { //it will delete the file in that filepath
        console.log('Error while clearing Images', err)
    })
}