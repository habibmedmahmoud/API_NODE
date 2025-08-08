const express = require("express");
const router = express.Router();
const Joi = require('joi');
const { VerifyTokenAndAdmin } = require('../middlewaes/verifyToken');
const { getAllAuthor, getAuthorById, createAuthor, updateAuthor, deleteAuthor } = require('../controllers/authorController');


// Route pour obtenir la liste de tous les authors
router.route('/').get(getAllAuthor);
// only admin 
// pour ajouter une author dans le base de donnes 
router.route('/').post(VerifyTokenAndAdmin, createAuthor);

// Route pour récupérer un author par ID
router.route('/:id').get(getAuthorById)
// Route pour mettre à jour un livre par ID
.put(VerifyTokenAndAdmin, updateAuthor)

// Route pour supprimer un author  par ID
.delete(VerifyTokenAndAdmin, deleteAuthor)


module.exports = router;