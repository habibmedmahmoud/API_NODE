const asyncHandler = require('express-async-handler');
const { Book, validateCreateBook, validateUpdateBook } = require('../models/books');

// Get all books
const getALLBooks = asyncHandler(async (req, res) => {
    const books = await Book.find().populate("author", ["_id", "firstName", "lastName"]);
    res.status(200).json(books);
});

// Get book by ID
const getBookById = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate("author");
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
    res.status(200).json(book);
});

// Create new book
const createBook = asyncHandler(async (req, res) => { // Changed to lowercase
    const { error } = validateCreateBook(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        price: req.body.price,
        cover: req.body.cover
    });

    const result = await book.save();
    res.status(201).json(result);
});

// Update book
const updateBook = asyncHandler(async (req, res) => {
    const { error } = validateUpdateBook(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });
    res.status(200).json(book);
});

// Delete book
const deleteBook = asyncHandler(async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });
    res.status(200).json({ message: "Livre supprimé avec succès" });
});

module.exports = {
    getALLBooks,
    getBookById,
    createBook, // Changed to lowercase
    updateBook,
    deleteBook
};