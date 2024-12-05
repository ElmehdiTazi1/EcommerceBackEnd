const express = require('express');
const HomeController = require('../controllers/fournisseur/HomeController');
const LoginController = require('../controllers/fournisseur/LoginController');
const ProduitController = require('../controllers/fournisseur/ProduitController');
const CategorieController = require('../controllers/fournisseur/CategorieController');
const VenteController = require('../controllers/fournisseur/VenteController');
const auth = require('../middlewares/auth');
const guest = require('../middlewares/guest');
const client = require('../Authorizations/clientAuthorization');
const fournisseur = require('../Authorizations/fournisseurAuthorization');
const admin = require('../Authorizations/adminAuthorization');

const router = express.Router();
router.get('/', auth,HomeController.index);
router.post('/addproduit' ,auth,ProduitController.create);

router.get('/editproduit/:id' ,auth,ProduitController.show);
router.post('/editproduit/:id' ,auth,ProduitController.edit);
router.get('/deleteproduit/:id' ,auth,ProduitController.delete);
//router.get('/:id', LoginController.show);
router.get('/produits',auth, ProduitController.index);
router.get('/categories',auth, CategorieController.index);
router.get('/addcategorie',auth, CategorieController.addCategorie);
router.get('/editcategorie/:id',auth, CategorieController.show);
router.get('/deletecategorie/:id',auth, CategorieController.delete);
router.post('/editcategorie/:id',auth, CategorieController.edit);
router.post('/addcategorie',auth, CategorieController.create);

router.get('/addproduit',auth,ProduitController.addProduit);
router.get('/login',guest, LoginController.index);
router.post('/login', LoginController.login);
router.post('/logout',auth, LoginController.logout);
router.get('/ventes',auth, VenteController.index);
//router.post('/login', LoginController.login);
//router.get('/:id/detail', fournisseurController.showDetail);
//router.post('/:id/produit', fournisseurController.addproduit);
//router.delete('/:id/produit/:produit', fournisseurController.deleteProduit);
//router.get('/:id/produits', fournisseurController.getProduits);
//router.get('/:id/ventes', fournisseurController.getVentes);
//router.get('/:id/offres', fournisseurController.getOffres);




module.exports = router;