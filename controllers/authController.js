const { User, validateLoginUser, validateRegisterUser } = require('../models/user');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name , phone, password, country } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) return res.status(400).json({ message: "Phone already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        phone,
        password: hashedPassword,
        country,
    });

    await user.save();
    const token = user.generateToken();

    res.status(201).json({
        status: "success",
        message: "User registered successfully",
        token,
        user: {
            id: user._id,
            name: user.name,
            phone: user.phone,
            country: user.country,
            isAdmin:user.isAdmin
        }
    });
});




exports.login = asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: "Invalid phone or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid phone or password" });

    const token = user.generateToken();

    res.json({
        token,
        user: {
            id: user._id,
            name: user.name,
            phone: user.phone,
            country: user.country,
            isAdmin:user.isAdmin
            
        }
    });
});

