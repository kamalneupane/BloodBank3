const express = require('express');
const router = express.Router();

const { 
    newRequest, 
    getSingleRequest,
    myRequest,
    allRequest,
    updateRequest,
    deleteRequest
} = require('../controller/requestController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.route('/request/new').post(isAuthenticatedUser, newRequest)
router.route('/request/:id').get(isAuthenticatedUser, getSingleRequest)
router.route('/requests/me').get(isAuthenticatedUser, myRequest)
router.route('/admin/requests').get(isAuthenticatedUser, authorizeRoles('admin'), allRequest)
router.route('/admin/request/:id')
                                .put(isAuthenticatedUser, authorizeRoles('admin'), updateRequest)
                                .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteRequest)



module.exports = router