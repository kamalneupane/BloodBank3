const Request = require('../models/request')
const Blood = require('../models/blood')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')

// create new request => request/new
exports.newRequest = catchAsyncErrors(async(req, res, next) => {
    const { 
        requestGroup,
        age,
        reason,
        phone,
        address
    } = req.body;

    const request = await Request.create({
        requestGroup,
        age,
        reason,
        phone,
        address,
        user: req.user._id
    });

    res.status(200).json({
        success: true,
        request
    })
});

// get single request => request/:id
exports.getSingleRequest = catchAsyncErrors( async (req, res, next) => {
    const request = await Request.findById(req.params.id).populate('user','name email')

    if(!request){
        return next( new ErrorHandler('No request made with this ID', 404))
    }
    res.status(200).json({
        success: true,
        request
    })
})
// get logged in user request => requests/me
exports.myRequest = catchAsyncErrors( async (req, res, next) => {
    const requests = await Request.find({ user: req.user.id })

    res.status(200).json({
        success: true,
        requests
    })
})
// get all request => admin/requests
exports.allRequest = catchAsyncErrors( async (req, res, next) => {
    const requests = await Request.find();

    res.status(200).json({
        success: true,
        requests
    })
})

// update/process request => admin/order/:id
exports.updateRequest = catchAsyncErrors( async( req, res, next) => {
    const request = await Request.findById(req.params.id);
    if(request.status === 'approved'){
        return next(new ErrorHandler('You have already respond this request',400))
    }

    const  id = request.requestGroup.blood
    const unit = request.requestGroup.units

    updateBlood(id, unit)

    // request.requestGroup.forEach(async item => {
    //     await updateBlood(item.blood, item.units);
    // })

    request.status = req.body.status

    await request.save();

    res.status(200).json({
        success: true
    })
})

async function updateBlood(id, units){
    const blood = await Blood.findById(id);
    blood.units = blood.units - units

    await blood.save({
        validateBeforeSave: false
    });
}

// Delete Request => admin/request/:id
exports.deleteRequest = catchAsyncErrors(async (req, res, next) => {
    const request = await Request.findById(req.params.id);
    if(!request){
        return next( new ErrorHandler('Request Not found', 404))
    }
    await request.remove();

    res.status(200).json({
        success: true
    })
})