const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Products = require('../models/products');
const FoodIngredients = require('../models/foodIngredients');
const foodRecipes = require('../models/foodRecipe');
const User = require('../models/userModel');
const priceCalculateModule = require("./BusinessModules/ProductModules/priceCalculateModule");

const homePage = async (req, res, next) => {
    try {
        res.render('home/homePage', { layout: '../layouts/Home/homeLayout', title: 'Yemek Tarifleri', description: '', keywords: '' });
    } catch (err) {
        console.log(err);
    }
};

const GetPrice = async (req, res, next) => {
    try {
        const ProductsList = [];
        const findedRecipe = await foodRecipes.findOne({ Recipe_Name: req.params.recipeName });
        const ProductList = findedRecipe.Recipe_Ingredients.split(',');
        let IngredientsList = [];
        for (let i = 0; i < ProductList.length; i++) {
            const words = ProductList[i].split(':')[0].split(' ');
            const lastWord = words[words.length - 1];
            const FoodFind = await Products.find({ product_name: { $regex: lastWord, $options: 'i' } });
            const info = {
                FoodName: ProductList[i].split(':')[0],
                productList: FoodFind,
                wantedQuantity: ProductList[i].split(':')[2],
                x: ProductList[i].split(':')[1]
            };
            IngredientsList[i] = await FoodIngredients.findOne({Ingredients_Name : info.FoodName});


            ProductsList.push(await priceCalculateModule.getCostOfProduct(info.productList, info.wantedQuantity, info.x));
        }
        console.log(ProductsList)
        res.render('home/showRecipePage', { layout: '../layouts/Home/homeLayout', title: 'Yemek Tarifleri', description: '', keywords: '', findedRecipe, IngredientsList ,ProductsList});
    } catch (err) {
        console.log(err);
    }
};


module.exports = {
    GetPrice,
    homePage
};
