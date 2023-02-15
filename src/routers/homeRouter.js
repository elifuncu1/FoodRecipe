const router = require('express').Router();
const homeController = require('../controllers/homeController');
const { route } = require('./adminRouter');


//GET

router.get('/GET/:ProductName/:categoryId/:quantity', homeController.getProductsWithPrice);


router.get('/GET/FoodIngredientsList',homeController.GetFoodIngredientsList)
router.get('/GET/FoodRecipeList',homeController.getFoodRecipeList)




router.get('/GET/test', homeController.Test);
router.get('/login/:idpw',homeController.Login)
router.get('/register/:informations',homeController.Register)
//Post

router.post('/GET/DetailsOfRecipe',homeController.getDetailsOfRecipe)

module.exports = router; 