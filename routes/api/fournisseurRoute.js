const express = require('express');
const HomeController = require('../controllers/HomeController');
const auth = require('../middlewares/auth');
const client = require('../Authorizations/clientAuthorization');
const fournisseur = require('../Authorizations/fournisseurAuthorization');
const admin = require('../Authorizations/adminAuthorization');
const router = express.Router();
router.get('/', HomeController.index);
router.get('/:id', fournisseurController.show);

router.post('/login', fournisseurController.login);
router.get('/:id/detail', fournisseurController.showDetail);
//router.post('/:id/produit', fournisseurController.addproduit);
//router.delete('/:id/produit/:produit', fournisseurController.deleteProduit);
router.get('/:id/produits', fournisseurController.getProduits);
//router.get('/:id/ventes', fournisseurController.getVentes);
//router.get('/:id/offres', fournisseurController.getOffres);




module.exports = router;