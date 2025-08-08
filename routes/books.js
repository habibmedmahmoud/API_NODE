const express = require("express");
const router = express.Router();
const { VerifyTokenAndAdmin } = require('../middlewaes/verifyToken'); // Fixed typo
const {
    getALLBooks,
    getBookById,
    createBook,  // Changed to lowercase for consistency
    updateBook,
    deleteBook
} = require('../controllers/BookController');

router.route('/')
    .get(getALLBooks)
    .post(VerifyTokenAndAdmin, createBook); // Fixed middleware name and case

router.route('/:id')
    .get(getBookById)
    .put(VerifyTokenAndAdmin, updateBook)
    .delete(VerifyTokenAndAdmin, deleteBook);

module.exports = router;