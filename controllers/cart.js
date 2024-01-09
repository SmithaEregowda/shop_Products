const { validationResult } = require('express-validator')
const Cart = require('../models/cart')
const Product = require('../models/product')

exports.postCart = async (req, res, next) => {
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
        let quantity = req.body.quantity ? req.body.quantity : 1

        const product = await Product.findById(prodId);
        if (!product) {
            const error = new Error('product not found');
            error.statusCode = 404;
            throw error
        }

        const userCart = await Cart.findOne({ userId: userId });
        if (!userCart) {
            const cart = new Cart({
                userId: userId,
                products: [{
                    product: product,
                    quantity: 1
                }]
            })

            const newCart = await cart.save();

            if (!newCart) {
                const error = new Error('not able to add Item to Cart');
                error.statusCode = 400;
                throw error
            }
            res.status(201).json({
                status:200,
                message: "product moved to cart successfully",
                cart: newCart
            })

        } else {
            let ProductIndex =
                userCart.products.findIndex(prod => prod?.product.toString() === prodId);
            if (ProductIndex > -1) {
                const productItem = userCart.products[ProductIndex];
                productItem.quantity = quantity
                userCart.products[ProductIndex] = productItem;
                const updatedCart = await userCart.save();
                res.status(201).json({
                    status:200,
                    message: "cart updated successfully",
                    cart: updatedCart
                })
            } else {
                userCart.products.push({
                    product: product,
                    quantity: quantity
                });
                const updatedCart = await userCart.save();
                res.status(201).json({
                    status:200,
                    message: "cart updated successfully",
                    cart: updatedCart
                })

            }

        }

    } catch (err) {
        next(err)
    }

}

exports.getCart = async (req, res, next) => {
    try {
        const userCart = await Cart.findOne({ userId: req.params.userId });
        if (!userCart) {
            const error = new Error('not able to find cart for the user');
            error.statusCode = 400;
            throw error
        }
        res.status(201).json({
            status:200,
            message: "cart retrieved successfully",
            cart: userCart
        })
    } catch (err) {
        next(err)
    }
}

exports.removefromCart = async (req, res, next) => {
    try {
        const userCart = await Cart.findOne({ userId: req.params.userId });
        if (!userCart) {
            const error = new Error('not able to find cart for the user');
            error.statusCode = 400;
            throw error
        }
        if (!req.query.prodId) {
            const error = new Error('please provide product information');
            error.statusCode = 400;
            throw error
        }
        userCart.products = userCart.products.filter(p => p.product.toString() !== req.query.prodId);
        const updatedCart = await userCart.save();

        res.status(201).json({
            status:200,
            message: "product removed from cart successfully",
            cart: updatedCart
        })
    } catch (err) {
        next(err)
    }
}

exports.clearCart = async (req, res, next) => {
    try {
        const userCart = await Cart.findOne({ userId: req.params.userId });

        if (!userCart) {
            const error = new Error('not able to find cart for the user');
            error.statusCode = 400;
            throw error
        }

        const removeCart = await userCart.remove({})
        
        if (!removeCart) {
            const error = new Error('not able to remove from cart for the user');
            error.statusCode = 400;
            throw error
        }

        res.status(201).json({
            message: "cart cleared successfully",
            status:200
        })

    } catch (err) {
        next(err)
    }
}