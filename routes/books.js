const express = require("express");
const router = express.Router();
const {
    verifyTokeAndAdmin
} = require('../middlewaes/verifyToken');
const {
    getALLBooks,
    getBookById,
    CreateBoook,
    updateBook,
    deleteBook
} = require('../controllers/BookController');

// api/books
router.route('/')
    .get(getALLBooks)
    .post(verifyTokeAndAdmin, CreateBoook);



// api/books/:
router.route('/:id').get(getBookById).put(verifyTokeAndAdmin, updateBook).delete(verifyTokeAndAdmin, deleteBook);


module.exports = router;