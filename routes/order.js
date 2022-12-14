const router = require('express').Router();
const isAuthenticated = require('../middleware/isauth');
const { OrderValidator } = require('./validation');
const { postOrder, getOrderByUser } = require('../controllers/order');

router.post('/create',isAuthenticated,OrderValidator,postOrder)

router.get('/:userId',isAuthenticated,getOrderByUser)

module.exports = router;