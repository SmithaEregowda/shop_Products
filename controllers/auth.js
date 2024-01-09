const { validationResult } = require('express-validator')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jsontoken = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
//---------- signup --------------
exports.Signup = async (req, res, next) => {
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation Failed');
            error.statusCode = 422;
            error.data = errors.array()
            throw error
        }

        //hashing to secure the password 
        const password = req.body.password;
        const hashedpassword = await bcrypt.hash(password, 12)
        if (!hashedpassword) {
            const error = new Error('password process failed');
            error.statusCode = 422;
            error.data = errors.array()
            throw error
        }
        const user = new User({
            ...req.body,
            password: hashedpassword
        });
        const result = await user.save();
        if (!result) {
            const error = new Error('creatuing user Failed!!')
            throw error;
        }
        // ---------- sending mail to user ------------------
        var transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "c67967c1f92adb",
                pass: "277a305fd1f92b"
            }
        });
        message = {
            from: "veggies@shop.com",
            to: result?.email,
            subject: "signed up successfully",
            text: "Welcome veggies"
        }
        transporter.sendMail(message, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                res.status(201).json({
                    message: 'Created Scucessfully',
                    user: result?._id,
                    status:200,
                })
            }
        })

    } catch (err) {
        next(err)
    }
}


//---------------- login ----------------

exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation Failed');
            error.statusCode = 422;
            error.data = errors.array()
            throw error
        }
        const email = req.body.username;
        const password = req.body.password;
        const loggedUser = await User.findOne({ email: email });
        if (!loggedUser) {
            const error = new Error('Invalid credentials');
            error.statusCode = 400;
            throw error
        }
        const isPasswordMatched = await bcrypt.compare(password, loggedUser.password)
        if (!isPasswordMatched) {
            const error = new Error('Invalid Password');
            error.statusCode = 400;
            throw error
        }
        const token = jsontoken.sign({
            email: loggedUser.email,
            userId: loggedUser._id.toString()
        },
            'veggies',
            { expiresIn: '24hr' }
        )
        res.status(200).json({
            message: "Logged in successfully",
            token: token,
            user: loggedUser?._id,
            status:200
        })

    } catch (err) {
        next(err)
    }
}
exports.getuser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            const error = new Error('Invalid UserId');
            error.statusCode = 422;
            throw error
        }

        const loggedUser = await User.findById(userId);
        if (!loggedUser) {
            const error = new Error('User Not Found');
            error.statusCode = 400;
            throw error
        }
        res.status(200).json({
            message: 'user retrived successfully',
            status:200,
            user: loggedUser
        })

    } catch (err) {
        next(err)
    }
}
exports.getAllUsers = async (req, res, next) => {
    try {
        const filterMethods= req.query.filter;
        let queryObject={};
        if(filterMethods){
            let filterArrays=filterMethods.split(',');
            for(let i in filterArrays){
                let Item=filterArrays[i];
                if(Item){
                    let singleQuery=Item.split(':');
                    queryObject[singleQuery[0]]=singleQuery[1];
                }
            }
        }
         const filterdUsers = await User.find(queryObject);
        if (!filterdUsers) {
            const error = new Error('User List Not Found');
            error.statusCode = 400;
            throw error
        }
        res.status(200).json({
            message: 'users retrived successfully',
            status:200,
            user: filterdUsers
        })

    } catch (err) {
        next(err)
    }
}

//----------------- forgotpassword ----------------------

exports.forgotPassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation Failed');
            error.statusCode = 422;
            error.data = errors.array()
            throw error
        }
        crypto.randomBytes(32, async (error, buffers) => {
            if (error) {
                const error = new Error();
                error.httpStatusCode = 500;
                throw error;
            }

            const token = buffers.toString('hex');
            const reqstedUser = await User.findOne({ email: req.body.email })
            if (!reqstedUser) {
                const error = new Error('User Not Found');
                error.statusCode = 400;
                throw error
            }
            reqstedUser.resetToken = token;
            reqstedUser.resetTokenExpire = Date.now() + 3600000;
            reqstedUser.save();
            res.status(200).json({
                message: 'reset link send to mail  successfully',
                status:200,
                link: `/reset-password/${token}`
            })
        })
    } catch (err) {
        next(err)
    }
}
exports.resetPassword = async (req, res, next) => {
    try {
        const token = req.params.token
        if (!token) {
            const error = new Error('invalid token');
            throw error;
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation Failed');
            error.statusCode = 422;
            error.data = errors.array()
            throw error
        }
        const reqstedUser = await User.findOne({
            resetToken: token,
            resetTokenExpire: { $gt: Date.now() }
            // _id:req.body.userId
        })
        if (!reqstedUser) {
            const error = new Error('User Not Found');
            error.statusCode = 400;
            throw error
        }
        const hashednewPassword = await bcrypt.hash(req.body.newPassword, 12);
        if (!hashednewPassword) {
            const error = new Error('invalid password, process failed');
            error.statusCode = 400;
            throw error
        }
        reqstedUser.password = hashednewPassword;
        reqstedUser.resetToken = null;
        reqstedUser.resetTokenExpire = undefined;
        reqstedUser.save();

        res.status(200).json({
            message: 'password reseted  successfully',
            status:200
        });
    } catch (err) {
        next(err)
    }
}

exports.UpdateUser = async (req, res, next) => {
    try {
        let userId = req.params.userId;
        let imageUrl='';
        if (req.file) {
             imageUrl = req.file.path.replace("\\", "/");
        }
        if (!userId) {
            const error = new Error('Invalid User');
            throw error;
        }
        let updatedUser;
        if(imageUrl){
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { ...req.body, imgurl: imageUrl },
                { new: true }
            );
        }else{
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { ...req.body },
                { new: true }
            );
        }

        if (!updatedUser) {
            const error = new Error('User Not Found');
            error.statusCode = 400;
            throw error
        }


        res.status(200).json({
            message: 'user updated successfully',
            user: updatedUser,
            status:200
        });
    } catch (err) {
        next(err)
    }
}