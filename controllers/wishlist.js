const { validationResult } = require('express-validator')
const WishList = require('../models/wishlist')
const Product = require('../models/product')

exports.postWishlist = async (req, res, next) => {
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


        const product = await Product.findById(prodId);
        if (!product) {
            const error = new Error('product not found');
            error.statusCode = 404;
            throw error
        }

        const userWishList = await WishList.findOne({ userId: userId });
        if (!userWishList) {
            const wishlist = new WishList({
                userId: userId,
                products: [{
                    productId: product
                }]
            })

            const newWishlist = await wishlist.save();

            if (!newWishlist) {
                const error = new Error('not able to add Item to WishList');
                error.statusCode = 400;
                throw error
            }

            res.status(201).json({
                message: "product moved to WishList successfully",
                wishlist: newWishlist
            })

        } else {

            let ProductIndex =
                userWishList.products
                    .findIndex(prod => prod?.productId.toString() === prodId);

            if (ProductIndex > -1) {
                res.status(201).json({
                    message: "product alerady Exist in wishlist",
                    wishlist: userWishList
                })

            } else {

                userWishList.products.push({
                    productId: product
                });

                const updatedWishlist = await userWishList.save();

                res.status(201).json({
                    message: "added to wishlist successfully",
                    wishlist: updatedWishlist
                })
            }
        }
    } catch (err) {
        next(err)
    }

}

exports.getWishList = async (req, res, next) => {
    try {
        const UserWishList = await WishList.findOne({ userId: req.params.userId });
        if (!UserWishList) {
            const error = new Error('not able to find wishlist for the user');
            error.statusCode = 400;
            throw error
        }
        res.status(201).json({
            message: "wishlist retrieved successfully",
            wishlist: UserWishList
        })
    } catch (err) {
        next(err)
    }
}

exports.removeFromWishList = async (req, res, next) => {
    try {
        const userWishList = await WishList.findOne({ userId: req.params.userId });
        if (!userWishList) {
            const error = new Error('not able to find WishList for the user');
            error.statusCode = 400;
            throw error
        }
        if (!req.query.prodId) {
            const error = new Error('please provide product information');
            error.statusCode = 400;
            throw error
        }
        userWishList.products = userWishList.products
            .filter(p => p.productId.toString() !== req.query.prodId);
        const updatedWishList = await userWishList.save();

        res.status(201).json({
            message: "product removed from WishList successfully",
            WishList: updatedWishList
        })
    } catch (err) {
        next(err)
    }
}