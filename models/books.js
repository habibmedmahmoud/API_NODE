const mongoose = require('mongoose');
const Joi = require('joi');
const Author = require('./author'); //

// Définition du schéma pour le modèle Book
const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 250
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: Author
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 5

    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    cover: {
        type: String,
        required: true,
        enum: ["soft cover", "hard caver"]

    }
}, {
    timestamps: true // Ajoute les champs createdAt et updatedAt automatiquement
});

// Création du modèle Book en se basant sur le schéma
const Book = mongoose.model("Book", BookSchema);
// Fonction de validation pour la création d'un livre
function validateCreateBook(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(250).required(),
        author: Joi.string().required(),
        description: Joi.string().trim().min(5).required(),
        price: Joi.number().min(0).required(),
        cover: Joi.string().valid("soft cover", "hard caver").required(),
    });

    return schema.validate(obj);
}

// Fonction de validation pour la mise à jour d'un livre
function validateUpdateBook(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(5).max(250),
        author: Joi.string(),
        description: Joi.string().trim().min(5),
        price: Joi.number().min(0),
        cover: Joi.string().valid("soft cover", "hard caver"),
    });

    return schema.validate(obj);
}

module.exports = {
    Book,
    validateCreateBook,
    validateUpdateBook
}