const express = require("express");
const router = express.Router();

const { verifyTokeAndAuthorization, verifyTokeAndAdmin } = require('../middlewaes/verifyToken');
const { updatUser, getAllUser, getUserById, deleteUser } = require("../controllers/userController");


// Update User

router.put('/:id', verifyTokeAndAuthorization, updatUser);



//  GET  User only admin

router.get('/', verifyTokeAndAdmin, getAllUser);



// GET Pyid User only admin et user 

router.get('/:id', verifyTokeAndAuthorization, getUserById);

// detele de users 
router.delete('/:id', verifyTokeAndAuthorization, deleteUser);



module.exports = router;