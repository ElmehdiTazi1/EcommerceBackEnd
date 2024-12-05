const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/myproduits', authController.myProduits);
router.get('/myfavoris', authController.myFavoris);
router.get('/mycommandes', authController.myCommandes);
router.get('/myventes', authController.myVentes);
router.get('/mypanierlignes', authController.myPanierlignes);
router.post('/myproduit', authController.addProduit);
router.post('/myfavoris', authController.addFavoris);
router.post('/mycommande', authController.addCommande);
router.post('/mypanierligne', authController.addPanierlignes);
router.put('/myproduit', authController.updateProduit);
router.put('/mypanierligne', authController.updatePanierlignes);
router.delete('/myproduit', authController.deleteProduit);
router.delete('/mypanierligne', authController.deletePanierlignes);
router.delete('/myfavoris', authController.deleteFavoris);



module.exports = router;