const User = require('../models/user')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')  

exports.registerUser = catchAsyncErrors(async(req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password
    })

    sendToken(user, 200, res);
})
// login user
exports.loginUser = catchAsyncErrors( async (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password){
        return next(new ErrorHandler('Please fill all fields', 400))
    }
    // finding user in database
    const user = await User.findOne({ email: email}).select('+password')
    if(!user){
        return next(new ErrorHandler('Invalid email',401))
    }
    // check if password is correct or not
    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch){
        return next(new ErrorHandler('Invalid Password'))
    }
    sendToken(user, 200, res);
})
// forgot password

exports.forgotPassword = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if(!user){
        return next(new ErrorHandler('Email not found', 404))
    }
    // get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false})

    // create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`
    const message = `Your password reset token is as follows:\n\n ${resetUrl} \n\n`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Blood Bank Password Recovery',
            message
        }) 
        res.status(200).json({
            success: true,
            message: `Email send to ${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message,500))
    }



})
// reset password => password/reset/:token
exports.resetPassword = catchAsyncErrors(async( req, res, next) => {
    // hash url token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne( {
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has been expires', 400))
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password doesnot match',400))
    }
    // setup new Password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;


    await user.save();

    sendToken(user, 200, res);

})
// get currently logged in user details
exports.getUserProfile = catchAsyncErrors( async(req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})
// update/change password
exports.updatePassword = catchAsyncErrors( async(req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    // check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if(!isMatched){
        return next(new ErrorHandler('Old password doesnot match',400))
    }
    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);

})
// update user profile
exports.updateProfile = catchAsyncErrors( async(req, res, next) => {
    const newUserData = {
       name: req.body.name,
       email: req.body.email 
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

// logout user
exports.logoutUser = catchAsyncErrors( async (req, res, next) => {
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Logged Out'
    })
})



// Admin routes

// Get all users
exports.getAllUsers = catchAsyncErrors( async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

// get User details => admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler(`User not found with ${req.params.id}`, 400))
    }
    res.status(200).json({
        success: true,
        user
    })

})
// update user profile => admin/user/:id
exports.updateUser = catchAsyncErrors( async(req, res, next) => {
    const newUserData = {
       name: req.body.name,
       email: req.body.email,
       role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})
// delete user => admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler(`User not found with ${req.params.id}`, 400))
    }
    await user.remove();

    res.status(200).json({
        success: true
    })

})

