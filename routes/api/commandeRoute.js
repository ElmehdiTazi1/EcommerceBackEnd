const express = require('express');
const commandeController = require('../../controllers/api/commandeController');
const auth = require('../../middlewares/api/auth');
const client = require('../../Authorizations/clientAuthorization');
const fournisseur = require('../../Authorizations/fournisseurAuthorization');
const admin = require('../../Authorizations/adminAuthorization');
const router = express.Router();

//router.get('/:id', auth, admin, commandeController.show);
//router.get('/', auth, admin, commandeController.index);
/*router.post('/:id', commandeController.add);
router.post('/:id', commandeController.update);
router.delete('/:id', commandeController.delete);*/
//router.get('/mycommandes', commandeController.myCommandes);
//router.get('/mypanierlignes', commandeController.myPanierlignes);
//router.get('/myfavoris', commandeController.myFavoris);




module.exports = router;