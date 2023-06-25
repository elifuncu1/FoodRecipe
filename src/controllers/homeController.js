const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Products = require('../models/products');
const FoodIngredients = require('../models/foodIngredients');
const foodRecipes = require('../models/foodRecipe');
const User = require('../models/userModel');


const GetPrice = async (req,res,next) => {
    try{
        var ProductsList = []
        const findRecipes = await foodRecipes.findOne({Recipe_Name: req.params.recipeName})
        
        const ProductList = findRecipes.Recipe_Ingredients.split(',')
        for(let i = 0;i<ProductList.length;i++){
            const words = ProductList[i].split(':')[0].split(' ')
            const lastWord = words[words.length - 1];
            const FoodFind = await Products.find({product_name:  { "$regex": lastWord, $options: 'i' }})
            var info = {

                FoodName: ProductList[i].split(':')[0],
                productList: FoodFind,
                wantedQuantity: ProductList[i].split(':')[2],
                x: ProductList[i].split(':')[1]
            }
            ProductsList.push(info)     
        }
        res.json(ProductsList)
    }
    catch (err){
        console.log(err)
    }
}
module.exports = {
    GetPrice
}