const router = require('express').Router();
const { getAllRequest, getRequestByUser, ProcessReq } = require('../controllers/reqProd');
const isAuthenticated = require('../middleware/isauth');

router.get('/req',isAuthenticated,getAllRequest)

router.get('/req/:userId',isAuthenticated,getRequestByUser)

router.post('/req/process',isAuthenticated,ProcessReq)

module.exports = router;