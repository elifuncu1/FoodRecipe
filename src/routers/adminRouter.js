const router = require('express').Router();
const adminController = require('../controllers/adminController');
const validetorMiddleware = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const multerConfig = require('../config/multerConfig');
/*get*/   
router.get('/', adminController.showHomePage);
router.get('/addproduct', adminController.showProductPage);
router.get('/recipe', adminController.showRecipePage);
//post
router.post('/postfoodIngredients',multerConfig.single('image'),adminController.postFoodIngredients)
router.post('/postfoodRecipe',multerConfig.single('image'),adminController.postfoodRecipe)

module.exports = router;