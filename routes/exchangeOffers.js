const express = require("express");
const router = express.Router();
const {
  createExchangeOffer,
  getMyOffers,
  getAllOffers,
  updateOfferStatus,
  deleteOffer,
} = require("../controllers/exchangeOffersController");
const { verifyToken, VerifyTokenAndAdmin } = require("../middlewaes/verifyToken");
const validateObjectId = require("../middlewaes/validateObjectId");

// Obtenir toutes les offres (accessible uniquement à l'admin)
router.route("/")
  .get(VerifyTokenAndAdmin, getAllOffers)     // GET /api/exchange-offers
  .post(verifyToken, createExchangeOffer);    // POST /api/exchange-offers

// Obtenir MES offres (GET) ou mettre à jour (PUT) ou supprimer (DELETE)
router.route("/:id")
  .get(validateObjectId, verifyToken, getMyOffers)              // GET /api/exchange-offers/:id — uniquement mes offres
  .put(validateObjectId , verifyToken, updateOfferStatus)        // PUT /api/exchange-offers/:id
  .delete( validateObjectId , verifyToken, deleteOffer);          // DELETE /api/exchange-offers/:id

module.exports = router;
