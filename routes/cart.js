const router = require('express').Router();
const { postCart, getCart, removefromCart, clearCart } = require('../controllers/cart');
const isAuthenticated = require('../middleware/isauth');
const { cartValidator } = require('./validation');

router.post('/create',isAuthenticated,cartValidator,postCart);

router.get('/:userId',isAuthenticated,getCart)

router.delete('/:userId',isAuthenticated,removefromCart)

router.delete('/clear/:userId',isAuthenticated,clearCart)

module.exports = router