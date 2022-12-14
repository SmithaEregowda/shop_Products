const {body,check}=require('express-validator')
const User=require('../models/user')
exports.signupValidator=[[ 
    body('password').trim().not().isEmpty().withMessage('confirmPassword is required'),
    body('name').trim().not().isEmpty().withMessage('name is required'),
    body('email').isEmail().custom((value,{req})=>{
        return User.findOne({email:value})
        .then(userDoc=>{
            if(userDoc){
                return Promise.reject('User Alerady Exists')
            }
        })
    }),
    body('MobileNumber').trim().not().isEmpty().withMessage('MobileNumber is required'),
    check('confirmPassword').trim().not().isEmpty().withMessage('password is required')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation is incorrect');
        }else{
            return true
        }
      }),
    check('userType').optional().custom((value,{req})=>{
       if(value!=='internal user'){
        throw new Error('invalid userType');
       }else{
        if(!req.body.userRole&&value ==='internal user'){
            throw new Error('userRole is required'); 
        }else if(req.body.userRole!=='superadmin'&& req.body.userRole!=='normaladmin'){
            throw new Error('userRole should be superadmin or normaladmin'); 
        }else{
            return true
        }
       }
    })
]]

exports.LoginValidator=[[
    body('username').trim().not().isEmpty().withMessage('email address is required'),
    body('password').trim().not().isEmpty().withMessage('password is required'),
]]

exports.forgotPassValidator=[[
    body('email').trim().not().isEmpty().withMessage('email address is required')
]]

exports.resetValidator=[[
    body('password').trim().not().isEmpty().withMessage('current password is required'),
    body('newPassword').trim().not().isEmpty().withMessage('new password is required')
]]

exports.cartValidator=[[
    body('userId').trim().not().isEmpty().withMessage('userId is required'),
    body('prodId').trim().not().isEmpty().withMessage('product Id is required')
]]

exports.OrderValidator=[[
    body('userId').trim().not().isEmpty().withMessage('userId is required'),
    body('prodId').trim().not().isEmpty().withMessage('product Id is required'),
    body('Address').trim().not().isEmpty().withMessage('Address is required'),
    body('totalPrice').trim().not().isEmpty().withMessage('totalPrice is required'),
    body('PayMentMode').trim().not().isEmpty().withMessage('PayMentMode is required'),
    // body('isDeliverd').trim().not().isEmpty().withMessage('isDeliverd is required')
]]