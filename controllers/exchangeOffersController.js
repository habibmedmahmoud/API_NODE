const asyncHandler = require('express-async-handler');
const { ExchangeOffer, validateCreateExchangeOffer , validateUpdateExchangeOffer } = require("../models/ExchangeOffer");


// @desc Créer une nouvelle offre de change
// @route POST /api/exchange-offers
// @access Privé

module.exports.createExchangeOffer = asyncHandler(async (req, res) => {
  const { error } = validateCreateExchangeOffer(req.body);

  const { fromCurrency, toCurrency, fromAmount, toAmount, rate, notes, expiresAt } = req.body;

  const offer = new ExchangeOffer({
    user: req.user.id,
    fromCurrency,
    toCurrency,
    fromAmount,
    toAmount,
    rate,
    notes,
    expiresAt,
  });

  const savedOffer = await offer.save();
  res.status(201).json(savedOffer);
});


// @desc Obtenir toutes MES offres
// @route GET /api/exchange-offers/:id (utilisé comme 'mes offres')
// @access Privé
module.exports.getMyOffers = asyncHandler(async (req, res) => {
  const offers = await ExchangeOffer.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(offers);
});


// @desc Obtenir toutes les offres (pour l'admin ou l'affichage global)
// @route GET /api/exchange-offers
// @access Admin
module.exports.getAllOffers = asyncHandler(async (req, res) => {
  const offers = await ExchangeOffer.find()
    .populate("user", "name country")
    .sort({ createdAt: -1 });

  res.status(200).json(offers);
});


// @desc Mettre à jour le statut d'une offre ("completed", "cancelled", etc.)
// @route PUT /api/exchange-offers/:id
// @access Privé
module.exports.updateOfferStatus = asyncHandler(async (req, res) => {
  const { error } = validateUpdateExchangeOffer(req.body);
  if (error) {
    return res.status(400).json({ message: "Données invalides.", errors: error.details });
  }

  const offer = await ExchangeOffer.findById(req.params.id);

  if (!offer) {
    return res.status(404).json({ message: "Offre non trouvée." });
  }

  if (offer.user.toString() !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ message: "Vous n'avez pas la permission de modifier cette offre." });
  }

  offer.status = req.body.status;
  await offer.save();

  res.status(200).json(offer);
});


// @desc Supprimer une offre de change
// @route DELETE /api/exchange-offers/:id
// @access Privé
module.exports.deleteOffer = asyncHandler(async (req, res) => {
  const offer = await ExchangeOffer.findById(req.params.id);   

  if (!offer) {
    return res.status(404).json({ message: "Offre non trouvée." });
  }

  if (offer.user.toString() !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ message: "Vous n'avez pas la permission de supprimer cette offre." });
  }

  await offer.deleteOne();
  res.status(200).json({ message: "Offre supprimée avec succès." });
});
