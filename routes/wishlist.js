const router = require('express').Router();

const { postWishlist, getWishList, removeFromWishList } = require('../controllers/wishlist');
const isAuthenticated = require('../middleware/isauth');
const { cartValidator } = require('./validation');

router.post('/create',isAuthenticated,cartValidator,postWishlist);

router.get('/:userId',isAuthenticated,getWishList)

router.delete('/:userId',isAuthenticated,removeFromWishList)

module.exports = router