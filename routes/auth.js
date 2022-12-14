const router = require('express').Router();
const
    {
        Signup,
        login,
        getuser,
        forgotPassword,
        resetPassword,
        UpdateUser,
        getAllUsers
    } = require('../controllers/auth')
const
    {
        signupValidator,
        LoginValidator,
        forgotPassValidator,
        resetValidator
    } = require('./validation')
const isAuthenticated = require('../middleware/isauth')
router.post('/signup', signupValidator, Signup);

router.post('/login', LoginValidator, login)

router.get('/profile/:userId', isAuthenticated, getuser)

router.get('/profiles', isAuthenticated, getAllUsers)

router.put('/update-user/:userId', isAuthenticated, UpdateUser)

router.post('/forgot-password', forgotPassValidator, forgotPassword)

router.post('/reset-password/:token', resetValidator, resetPassword)
module.exports = router