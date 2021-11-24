const Blood = require('../models/blood')

// create new Blood Group
exports.newBlood = async (req, res, next) => {
    const blood = await Blood.create(req.body);
    res.status(201).json({
        success: true,
        blood
    })
}
// get all blood group
exports.getAllBloods = async (req, res, next) => {
    const bloods = await Blood.find();
    console.log('wtf')
    if(!bloods){
        return res.status(200).json({
            success: true,
            bloods
        })
    }
    res.status(200).json({
        success: true,
        count: bloods.length,
        bloods
    })
}
// get single blood group
exports.getSingleBlood = async(req, res, next) => {
    const blood = await Blood.findById(req.params.id);
    if(!blood){
        return res.status(404).json({
            success: false,
            message: 'Blood not found'
        })
    }
    res.status(200).json({
        success: true,
        blood
    })
}
// update blood group
exports.updateBlood = async( req, res, next) => {
    let blood = await Blood.findById(req.params.id);
    if(!blood){
        return res.status(404).json({
            success: false,
            message: 'Blood group not found'
        })
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
}
// delete blood
exports.deleteBlood = async(req, res, next) => {
    const blood = await Blood.findById(req.params.id)
    if(!blood){
        return res.status(404).json({
            success: false,
            message: 'No blood group found'
        })
    }
    await blood.remove();
    res.status(200).json({
        success: false,
        message: 'Blood is deleted successfully'
    })
}
