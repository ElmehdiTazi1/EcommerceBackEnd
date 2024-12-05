const express = require('express');
const categorieController = require('../../controllers/api/categorieController');
const auth = require('../../middlewares/api/auth');
const router = express.Router();


router.get('/',auth ,categorieController.index);




module.exports = router;