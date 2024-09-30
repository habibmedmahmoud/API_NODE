const asyncHandler = require('express-async-handler');
const {
    Book,
    validateCreateBook,
    validateUpdateBook
} = require('../models/books'); // Import du modèle Book



const getALLBooks = asyncHandler(async(req, res) => {
    // const { minPrice, maxPrice } = req.query;

    const books = await Book.find().populate("author", ["_id", "firstName", "lastName"]); // Récupérer tous les livres
    res.status(200).json(books);

});


const getBookById = asyncHandler(async(req, res) => {

    const book = await Book.findById(req.params.id).populate("author"); // Rechercher le livre par ID
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
    res.status(200).json(book);

});

const CreateBoook = asyncHandler(async(req, res) => {
    const { error } = validateCreateBook(req.body); // Valider les données du corps de la requête
    if (error) return res.status(400).json({ message: error.details[0].message });


    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        price: req.body.price,
        cover: req.body.cover
    });

    const result = await book.save(); // Enregistrer le livre dans la base de données
    res.status(201).json(result);

});

const updateBook = asyncHandler(async(req, res) => {
    const { error } = validateUpdateBook(req.body); // Valider les données mises à jour
    if (error) return res.status(400).json({ message: error.details[0].message });


    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });
    res.status(200).json(book);

});

const deleteBook = asyncHandler(async(req, res) => {

    const book = await Book.findByIdAndDelete(req.params.id); // Supprimer le livre par ID
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });
    res.status(200).json({ message: "Livre supprimé avec succès" });

});

module.exports = {
    getALLBooks,
    getBookById,
    CreateBoook,
    updateBook,
    deleteBook

}