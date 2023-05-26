const router = require('express').Router();
const homeController = require('../controllers/homeController');
const { route } = require('./adminRouter');


//GET


router.get('/',homeController.homePage)
router.get('/tarif',homeController.showDetailsOfRecipePage)
router.get('/GET/:ProductName/:categoryId/:quantity', homeController.getProductsWithPrice);
//router.get('/register',homeController.showRegisterPage)

router.get('/GET/FoodIngredientsList',homeController.GetFoodIngredientsList)
router.get('/GET/FoodRecipeList',homeController.getFoodRecipeList)




router.get('/GET/test', homeController.Test);
//Post

router.post('/GET/DetailsOfRecipe',homeController.getDetailsOfRecipe)

module.exports = router; 