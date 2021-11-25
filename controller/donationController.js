const Donation = require('../models/donation')
const Blood = require('../models/blood')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')

// New Donation Request => donation/new
exports.newDonation = catchAsyncErrors(async (req, res, next) => {
    const {
        donateGroup,
        age,
        disease,
        phone,
        address
    } = req.body;
    
    const donation = await Donation.create({
        donateGroup,
        age,
        disease,
        phone,
        address,
        user: req.user._id
    })
    res.status(200).json({
        sucess: true,
        donation
    })
});
// get single donation => donation/:id
exports.getSingleDonation = catchAsyncErrors(async(req, res, next) => {
    const donation = await Donation.findById(req.params.id).populate('user','name email');

    if(!donation){
        return next(new ErrorHandler('Donation blood not found with this id',404))
    }
    res.status(200).json({
        success: true,
        donation
    })
});
// get loggedIn user donations => donations/me
exports.myDonations = catchAsyncErrors(async(req, res, next) => {
    const donations = await Donation.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        donations
    })
})
// get all donations => admin/donations
exports.allDonations = catchAsyncErrors( async(req, res, next) => {
    const donations = await Donation.find();
    res.status(200).json({
        succcess: true,
        donations
    })
})
// update donation => admin/donation/:id
exports.updateDonation = catchAsyncErrors(async(req, res, next) => {
    const donation = await Donation.findById(req.params.id);
    if(!donation){
        return next(new ErrorHandler('Donation not found with this id', 404))
    }
    if(donation.status === 'approved'){
        return next(new ErrorHandler('You have already respond this donation request'))
    }


    donation.donateGroup.forEach(async item => {
        await updateBlood(item.blood, item.units);
    })

    donation.status = req.body.status
    await donation.save();

    res.status(200).json({
        success: true
    })
})

async function updateBlood(id, units){
    const blood = await Blood.findById(id);
    blood.units = blood.units + units

    await blood.save({
        validateBeforeSave: false
    });
}

// Delete donation request => admin/donation/:id
exports.deleteDonation = catchAsyncErrors(async (req, res, next) => {
    const donation = await Donation.findById(req.params.id);
    if(!donation){
        return next(new ErrorHandler('Donation not found', 404))
    }
    await donation.remove();
    res.status(200).json({
        success: true
    })
})