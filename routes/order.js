const router = require('express').Router();
const isAuthenticated = require('../middleware/isauth');
const { OrderValidator } = require('./validation');
const { postOrder, getOrderByUser, getOrderById, UpdateOrder } = require('../controllers/order');

router.post('/create',isAuthenticated,OrderValidator,postOrder)

router.get('/:userId',isAuthenticated,getOrderByUser);

router.get('/order/:orderId',isAuthenticated,getOrderById);

router.put('/cancelorder/:orderId',isAuthenticated,UpdateOrder)

module.exports = router;