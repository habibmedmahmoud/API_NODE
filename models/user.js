const mongoose = require('mongoose');
const Joi = require('joi');
const UserSchema = new mongoose.Schema({
    email: {

        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        unique: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 200,

    },
    password: {

        type: String,
        required: true,
        trim: true,
        minlength: 6,

    },
    isAdmin: {

        type: Boolean,
        default: false

    },


}, {
    timestamps: true // Ajoute les champs createdAt et updatedAt automatiquement}

});

const User = new mongoose.model("User", UserSchema);
// validate Register User 

function validateRegisterUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        username: Joi.string().trim().min(2).max(200).required(),
        password: Joi.string().trim().min(6).required(),
        isAdmin: Joi.bool(),

    });

    return schema.validate(obj);
}

// validate Login  User 
function validateLoginUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().trim().min(6).required(),

    });

    return schema.validate(obj);
}

// validate Update User 
function validateUpdateerUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).email(),
        username: Joi.string().trim().min(2).max(200),
        password: Joi.string().trim().min(6),
        email: Joi.bool(),

    });

    return schema.validate(obj);
}

module.exports = {
    User,
    validateLoginUser,
    validateRegisterUser,
    validateUpdateerUser
}