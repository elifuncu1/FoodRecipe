const router = require('express').Router();
const apiController = require('../controllers/apiController');
const multerConfig = require('../config/multerConfig');


router.post('/nameToIngredients',apiController.AuthenticateCheck,apiController.nameToIngredients)

module.exports = router; 