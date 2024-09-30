const asyncHandler = require('express-async-handler');
const { Author, validateCreateAuthor, validateUpdateAuthor } = require('../models/author');



const getAllAuthor = asyncHandler(async(req, res) => {

    const authors = await Author.find(); // Récupérer tous les livres
    res.status(200).json(authors);

});

const getAuthorById = asyncHandler(async(req, res) => {

    const author = await Author.findById(req.params.id); // Récupérer l'auteur directement de MongoDB
    res.status(200).json(author

    );
    if (!author) {
        return res.status(404).json({ message: 'Author not found' });

    }
});
const createAuthor = asyncHandler(async(req, res) => {
    const { error } = validateCreateAuthor(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }


    const author = new Author({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        image: req.body.image
    });

    const result = await author.save();
    res.status(201).json(result);

});
const updateAuthor = asyncHandler(async(req, res) => {
    const { error } = validateUpdateAuthor(req.body); // Valider les données mises à jour
    if (error) return res.status(400).json({ message: error.details[0].message });


    const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!author) return res.status(404).json({ message: "author non trouvé" });
    res.status(200).json(author);

});
const deleteAuthor = asyncHandler(async(req, res) => {

    const author = await Author.findByIdAndDelete(req.params.id); // Supprimer le livre par ID
    if (!author) return res.status(404).json({ message: "author non trouvé" });
    res.status(200).json({ message: "author supprimé avec succès" });

});
module.exports = {
    getAllAuthor,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor

}