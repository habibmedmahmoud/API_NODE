const { User, validateUpdateerUser } = require('../models/user');
const asyncHandler = require('express-async-handler');

const updatUser = asyncHandler(async(req, res) => {
    // validation 

    const { error } = validateUpdateerUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    console.log(req.headers);
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const updaeuser = await User.findByIdAndUpdate(req.params.id, {

            $set: {
                email: req.body.email,
                password: req.body.password,
                username: req.body.username
            }
        }, { new: true }

    ).select("-password");
    res.status(200).json(updaeuser);
});
const getAllUser = asyncHandler(async(req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
});

const getUserById = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: "user not found " });
    }

});
const deleteUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: " user has beeen deleted successfully" });
    } else {
        res.status(404).json({ message: "user not found " });
    }

});
module.exports = {
    updatUser,
    getAllUser,
    getUserById,
    deleteUser
}