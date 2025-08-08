// models/user.js
const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 200,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    country: {
        type: String,
        enum: ['RU', 'MR'],
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    profilePhoto: {
        type: Object,
        default: {
            url: "",
            publicId: null,
        },
    },
    isVerified: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

UserSchema.methods.generateToken = function () {
     return jwt.sign({id : this._id , isAdmin: this.isAdmin },process.env.JWT_SECRET_KEY);

};

const User = mongoose.model("User", UserSchema);

function validateRegisterUser(obj) {
    const schema = Joi.object({
        name: Joi.string().trim().min(2).max(200).required(),
        phone: Joi.string().required(),
        password: Joi.string().min(6).required(),
        country: Joi.string().valid('RU', 'MR').required(),
    });
    return schema.validate(obj);
}

function validateLoginUser(obj) {
    const schema = Joi.object({
        phone: Joi.string().required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(obj);
}

function validateUpdateUser(obj) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(10),
        phone: Joi.string().pattern(/^[0-9]+$/),
        country: Joi.string().valid('RU', 'MR').required(),
        
    });
    return schema.validate(obj, { abortEarly: false });
}

module.exports = {
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser
};
