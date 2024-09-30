const express = require("express");
const router = express.Router();
const Joi = require('joi');
const { verifyTokeAndAdmin } = require('../middlewaes/verifyToken');
const { getAllAuthor, getAuthorById, createAuthor, updateAuthor, deleteAuthor } = require('../controllers/authorController');


// Route pour obtenir la liste de tous les authors
router.get('/', getAllAuthor);

// Route pour récupérer un author par ID
router.get('/:id', getAuthorById);



// only admin 
// pour ajouter une author dans le base de donnes 
router.post('/', verifyTokeAndAdmin, createAuthor);

// Route pour mettre à jour un livre par ID
router.put('/:id', verifyTokeAndAdmin, updateAuthor);
// Route pour supprimer un author  par ID
router.delete('/:id', verifyTokeAndAdmin, deleteAuthor);


module.exports = router;