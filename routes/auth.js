const express = require("express");
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { User, validateLoginUser, validateRegisterUser, validateUpdateerUser } = require('../models/user');

router.post('/register', (async(req, res) => {

    const {
        error
    } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "this user already  resisterd " });
    }
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    });
    const result = await user.save();
    const token = null;

    const { password, ...other } = result._doc;
    res.status(201).json({...other, token });
}));


// login user 
router.post('/login', (async(req, res) => {

    const {
        error
    } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: "invalid email or password" });
    }


    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordMatch) {
        return res.status(400).json({ message: "invalid email or password" });
    }


    const token = null;

    const { password, ...other } = user._doc;
    res.status(200).json({...other, token });
}));


module.exports = router;