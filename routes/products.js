const router = require('express').Router();
const {
    getAllProducts,
    AddProducts,
    getProductById,
    deleteProductById,
    updateProduct,
    getProductByUserId
} = require('../controllers/products')

const isAuthenticated = require('../middleware/isauth')

router.get('/', isAuthenticated, getAllProducts)

router.post('/create', isAuthenticated, AddProducts)

router.get('/:prodId', isAuthenticated, getProductById)

router.delete('/:prodId', isAuthenticated, deleteProductById)

router.put('/:prodId', isAuthenticated, updateProduct);

router.get('/user/:userId',isAuthenticated,getProductByUserId)

module.exports = router;