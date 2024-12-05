const express = require('express');
const clientController = require('../../controllers/api/clientController');
const client = require('../../Authorizations/clientAuthorization');
const admin = require('../../Authorizations/adminAuthorization');
const auth = require('../../middlewares/api/auth');
const router = express.Router();

router.get('/execute', clientController.execute);
router.get('/createpayment', clientController.payement);
router.post('/:id/addcommandes', clientController.addCommandesfromPanier);
router.get('/retrypassword', clientController.retryPassword);
router.post('/login', clientController.login);
router.post('/register', clientController.register);
router.get('/:id', auth,  clientController.show);
router.get('/', auth, admin, clientController.index);
router.get('/:id/detail', auth, clientController.showDetail);

router.post('/:id/favoris', auth, clientController.addToFavoris);
//router.post('/:id/commande', auth, clientController.addCommande);
router.get('/:id/commandes', auth, client, clientController.getCommandes);
router.get('/:id/favoris', auth, client, clientController.getFavoris);
router.post('/:id/favoris/:produit', auth, client, clientController.deleteFromFavoris);
router.post('/:id/panier', auth, client, clientController.addToPanier);
router.get('/:id/panier', auth, client, clientController.getPanier);
router.post('/:id/panier/:panier', auth, client, clientController.deleteFromPanier);





module.exports = router;