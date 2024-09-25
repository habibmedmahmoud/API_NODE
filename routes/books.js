const express = require("express");
const router = express.Router();
const {
    Book,
    validateCreateBook,
    validateUpdateBook
} = require('../models/books'); // Import du modèle Book

// Route pour obtenir la liste de tous les livres
router.get('/', async(req, res) => {
    try {
        const books = await Book.find().populate("author", ["_id", "firstName", "lastName"]); // Récupérer tous les livres
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des livres" });
    }
});

// Route pour obtenir un livre par ID
router.get('/:id', async(req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate("author"); // Rechercher le livre par ID
        if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du livre" });
    }
});

// Route pour ajouter un livre
router.post('/', async(req, res) => {
    const { error } = validateCreateBook(req.body); // Valider les données du corps de la requête
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            price: req.body.price,
            cover: req.body.cover
        });

        const result = await book.save(); // Enregistrer le livre dans la base de données
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du livre" });
    }
});

// Route pour mettre à jour un livre par ID
router.put('/:id', async(req, res) => {
    const { error } = validateUpdateBook(req.body); // Valider les données mises à jour
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) return res.status(404).json({ message: "Livre non trouvé" });
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du livre" });
    }
});

// Route pour supprimer un livre par ID
router.delete('/:id', async(req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id); // Supprimer le livre par ID
        if (!book) return res.status(404).json({ message: "Livre non trouvé" });
        res.status(200).json({ message: "Livre supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du livre" });
    }
});



module.exports = router;