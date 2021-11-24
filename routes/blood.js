const express = require('express')
const router = express.Router()

const { newBlood, getAllBloods, getSingleBlood, updateBlood, deleteBlood } = require('../controller/bloodController')


router.route('/blood/new').post(newBlood)
router.route('/bloods').get(getAllBloods)
router.route('/blood/:id')
                    .get(getSingleBlood)
                    .put(updateBlood)
                    .delete(deleteBlood)
module.exports = router