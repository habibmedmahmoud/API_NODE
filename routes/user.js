const express = require("express");
const router = express.Router();
const {
    verifyToken ,
    VerifyTokenAndAdmin , 
    VerifyTokenAndOnlyUser,
    VerifyTokenAndAuthorization
} = require("../middlewaes/verifyToken");

const {
    
    updateProfile,
    uploadImage,
    getAllUsers,
    getUserById,
    deleteUser,
    getUserCount,
    changePassword
    
} = require("../controllers/userController");

const validateObjectId = require("../middlewaes/validateObjectId");
const PhotoUpload = require("../middlewaes/photoupload");

// api/users/profile
router.route('/profile').get(VerifyTokenAndAdmin, getAllUsers);
// api/users/profile/profile-photo-upload
router.route('/profile/profile-photo-upload').post(verifyToken, PhotoUpload.single('image'), uploadImage);

router.route('/profile/:id')
.get(validateObjectId,getUserById)
.put( validateObjectId, VerifyTokenAndOnlyUser, PhotoUpload.single('profilePhoto'), updateProfile)
.delete(validateObjectId, VerifyTokenAndAuthorization, deleteUser);
// api/users/count
router.route('/count').get(VerifyTokenAndAdmin,getUserCount);
router.route('/change-password/:id').put(validateObjectId,verifyToken,changePassword);



module.exports = router;
