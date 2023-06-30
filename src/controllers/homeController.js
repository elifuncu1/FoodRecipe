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

const GetPrice = async (req,res,next) => {
  try{
      var ProductsList = []
      const findRecipes = await foodRecipes.findOne({Recipe_Name: req.params.recipeName})
      console.log(findRecipes)
      const ProductList = findRecipes.Recipe_Ingredients
      for(let i = 0;i<ProductList.length;i++){
          const words = ProductList[i].name.split(' ')
          const lastWord = words[words.length - 1];
          const FoodFind = await Products.find({$and:[{product_name:  { "$regex": lastWord, $options: 'i' }},{product_category: ProductList[i].product_category}]})
          var info = {
              FoodName: ProductList[i].name,
              productList: FoodFind,
              wantedQuantity: ProductList[i].weight,
              x: ProductList[i].weight
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
    GetPrice,
    homePage
};
