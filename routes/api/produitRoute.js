const express = require('express');
const produitController = require('../../controllers/api/produitController');
const auth = require('../../middlewares/api/auth');
const router = express.Router();

router.get('/recherche/:key',auth, produitController.reachBykey);
router.get('/:categorie',auth ,produitController.reachByCategorie);
router.get('/',auth ,produitController.index);







module.exports = router;