const router = require('express').Router();
const homeController = require('../controllers/homeController');
const multerConfig = require('../config/multerConfig');

router.get('/yemek/:recipeName',homeController.GetPrice)
router.get('/category/:categoryName',homeController.showRecipeWithCategory)
router.get('/recipe/add',homeController.showAddRecipePage)
router.get('/',homeController.homePage)
//router.get('/tarif',homeController.showDetailsOfRecipePage)
router.get('/register',homeController.showRegisterPage)
router.get('/GET/:ProductName/:categoryId/:quantity', homeController.getProductsWithPrice);
//router.get('/register',homeController.showRegisterPage)

router.get('/GET/FoodIngredientsList',homeController.GetFoodIngredientsList)
router.get('/GET/FoodRecipeList',homeController.getFoodRecipeList)
router.get('/user',homeController.showUserDetailsPage)




router.get('/GET/test', homeController.Test);
//Post
router.post('/reviews/:recipeId', homeController.postFoodRecipeReview);
router.post('/register',homeController.Register)
router.post('/GET/DetailsOfRecipe',homeController.getDetailsOfRecipe)
router.post('/postfoodRecipe', multerConfig.array('photos', 10), homeController.postfoodRecipe);


module.exports = router; 