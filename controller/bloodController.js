const Blood = require('../models/blood')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
// create new Blood Group
exports.newBlood = catchAsyncErrors( async (req, res, next) => {
    const blood = await Blood.create(req.body);
    res.status(201).json({
        success: true,
        blood
    })
})
// get all blood group
exports.getAllBloods = catchAsyncErrors (async (req, res, next) => {
    const bloods = await Blood.find();
    if(!bloods){
        return next(new ErrorHandler('Blood not found', 404))
    }
    res.status(200).json({
        success: true,
        count: bloods.length,
        bloods
    })
})
// get single blood group
exports.getSingleBlood = catchAsyncErrors ( async(req, res, next) => {
    const blood = await Blood.findById(req.params.id);
    if(!blood){
       return next(new ErrorHandler('Blood not found', 404))
    }
    res.status(200).json({
        success: true,
        blood
    })
})
// update blood group
exports.updateBlood = catchAsyncErrors ( async( req, res, next) => {
    let blood = await Blood.findById(req.params.id);
    if(!blood){
        return next(new ErrorHandler('Blood not found', 404))
    }
    blood = await Blood.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        blood
    })
})
// delete blood
exports.deleteBlood = catchAsyncErrors ( async(req, res, next) => {
    const blood = await Blood.findById(req.params.id)
    if(!blood){
        return next(new ErrorHandler('Blood not found',404))
    }
    await blood.remove();
    res.status(200).json({
        success: false,
        message: 'Blood is deleted successfully'
    })
})
