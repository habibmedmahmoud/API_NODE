const express = require("express");
const router = express.Router();
const Joi = require('joi');

// Assurez-vous d'importer correctement le modèle 'Author'
const Author = require("../models/author");


// Route pour obtenir la liste de tous les authors
router.get('/', async(req, res) => {
    try {
        const authors = await Author.find(); // Récupérer tous les livres
        res.status(200).json(authors);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des authors" });
    }
});




// Route pour supprimer un author  par ID
router.delete('/:id', async(req, res) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id); // Supprimer le livre par ID
        if (!author) return res.status(404).json({ message: "author non trouvé" });
        res.status(200).json({ message: "author supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du author" });
    }
});


// pour recuper les author par bayId
// Route pour récupérer un author par ID
router.get('/:id', async(req, res) => {
    try {
        const author = await Author.findById(req.params.id); // Récupérer l'auteur directement de MongoDB
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.status(200).json(author);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'author' });
    }
});




// pour ajouter une author dans le base de donnes 
router.post('/', async(req, res) => {
    const { error } = validateCreateAuthor(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const author = new Author({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nationality: req.body.nationality,
            image: req.body.image
        });

        const result = await author.save();
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Route pour mettre à jour un livre par ID
router.put('/:id', async(req, res) => {
    const { error } = validateUpdateAuthor(req.body); // Valider les données mises à jour
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!author) return res.status(404).json({ message: "author non trouvé" });
        res.status(200).json(author);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de author " });
    }
});

function validateCreateAuthor(obj) {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(200).required(),
        lastName: Joi.string().trim().min(3).max(200).required(),
        nationality: Joi.string().trim().min(3).max(200).required(),
        image: Joi.string().min(0),
    });

    return schema.validate(obj);
}

// Fonction de validation pour la mise à jour d'un author 
function validateUpdateAuthor(obj) {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(200),
        lastName: Joi.string().trim().min(3).max(200),
        nationality: Joi.string().trim().min(3).max(200),
        image: Joi.string().min(0),
    });

    return schema.validate(obj);
}

module.exports = router;