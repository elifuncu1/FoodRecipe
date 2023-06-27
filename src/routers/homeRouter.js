const router = require('express').Router();
const homeController = require('../controllers/homeController');

router.get('/yemek/:recipeName',homeController.GetPrice)
router.get('/',homeController.homePage)


module.exports = router; 