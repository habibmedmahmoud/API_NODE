const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    nationality: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    image: {
        type: String,
        default: "default-avatar.png"
    },
}, {
    timestamps: true
});

// Notez ici que 'mongoose.model' n'a pas besoin du mot-clé 'new'
const Author = mongoose.model("Author", AuthorSchema);

module.exports = Author;