const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Products = require('../models/products');
const FoodIngredients = require('../models/foodIngredients');
const foodRecipes = require('../models/foodRecipe');
const User = require('../models/userModel');
const priceCalculateModule = require("./BusinessModules/ProductModules/priceCalculateModule");
const jcc = require('json-case-convertor');

const homePage = async (req, res, next) => {
    try {
        res.render('home/homePage', { layout: '../layouts/Home/homeLayout', title: 'Yemek Tarifleri', description: '', keywords: '' });
    } catch (err) {
        console.log(err);
    }
};

const GetPrice = async (req, res, next) => {
    try {
      const findedRecipe = await foodRecipes.findOne({ Recipe_Name: req.params.recipeName });
      const recipeIngredients = findedRecipe.Recipe_Ingredients;
      const ProductList = recipeIngredients.map(ingredient => ingredient.name);
      const foodFindPromises = recipeIngredients.map(async (ingredient) => {
        const FoodFind = await Products.find({
          $and: [
            { product_name: { $regex: new RegExp(ingredient.name, 'i') } },
            { product_category: { $regex: new RegExp(`^${ingredient.category}$`, 'i') } }
          ]
        });
        
        
        
        return FoodFind;
      });
      const FoodFinds = await Promise.all(foodFindPromises);
      res.json(FoodFinds)
      const IngredientsList = [];
      const ProductsList = [];
  
      for (let i = 0; i < recipeIngredients.length; i++) {
        const ingredient = recipeIngredients[i];
        const FoodFind = FoodFinds[i];
        const info = {
          FoodName: ingredient.name,
          productList: FoodFind,
          wantedQuantity: ingredient.weight,
          x: 1
        };
        ProductsList.push(await priceCalculateModule.getCostOfProduct(await jcc.upperCaseValues(info.productList), info.wantedQuantity, info.x));
        IngredientsList.push(await FoodIngredients.findOne({ Ingredients_SubName : recipeIngredients[i].name }));
        
      }
      res.json(ProductsList)
      res.render('home/showRecipePage', { layout: '../layouts/Home/homeLayout', title: 'Yemek Tarifleri', description: '', keywords: '', findedRecipe, IngredientsList, ProductsList });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  

module.exports = {
    GetPrice,
    homePage
};
