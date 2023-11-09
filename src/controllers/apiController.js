const FoodIngredients = require('../models/foodIngredients');
const foodRecipes = require('../models/foodRecipe');
const Products = require('../models/products');
const priceCalculateModule = require("./BusinessModules/ProductModules/priceCalculateModule");
const jcc = require('json-case-convertor');
const User = require('../models/userModel');
const RecipeCategories = require('../models/recipeCategoryModel');
// Authenticate
const AuthenticateCheck = async (req,res,next) => {
    try{
        if(req.headers.authorization == process.env.SESSION_SECRET){
            next();
        }
        else{
            const bilgiler = {
                status: "Authorization Failed"
            }
            res.json(bilgiler)
        }
    }
    catch{
        const bilgiler = {
            status: "Authorization Failed"
        }
        res.json(bilgiler)
    }
}

// İsimden Malzemeleri Getirir 
const nameToIngredients = async (req,res,next) => {
    try{
        const findedRecipe = await foodRecipes.findOne({ Recipe_Name: req.body.recipeName });

        const recipeIngredients = findedRecipe.Recipe_Ingredients;
        //   const ProductList = recipeIngredients.map(ingredient => ingredient.name);
        const foodFindPromises = recipeIngredients.map(async (ingredient) => {
        const FoodFind = await Products.find({$and:[{product_name: {"$regex": ingredient.subname, $options: 'i' }},{product_category: {"$regex": ingredient.category, $options: 'i' }}]});
        return FoodFind;
        });
        const FoodFinds = await Promise.all(foodFindPromises);
        const IngredientsList = [];
        const ProductsList = [];


        for (let i = 0; i < recipeIngredients.length; i++) {
        const ingredient = recipeIngredients[i];
        const FoodFind = FoodFinds[i];
        const info = {
            FoodName: ingredient.name,
            SubName: ingredient.subname,
            productList: FoodFind,
            wantedQuantity: ingredient.weight,
            x: 1
        };
        ProductsList.push(await priceCalculateModule.getCostOfProduct(await jcc.upperCaseValues(info.productList), info.wantedQuantity, info.x));
        IngredientsList.push(await FoodIngredients.findOne({ Ingredients_SubName: recipeIngredients[i].subname }));

        }
        res.json(IngredientsList)
    }
    catch (err){
        console.log(err)
    }
}





module.exports = {
    AuthenticateCheck,
    nameToIngredients
}