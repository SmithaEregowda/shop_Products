const router = require('express').Router();
const { postPayment } = require('../controllers/payment');
const isAuthenticated = require('../middleware/isauth');

router.post('/pay',isAuthenticated,postPayment)

module.exports = router;