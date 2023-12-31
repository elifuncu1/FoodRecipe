const FoodIngredients = require('../models/foodIngredients');
const foodRecipes = require('../models/foodRecipe');
const ids = require('../models/ids');
const ProductCategories = require('../models/productCategoryModel');
const RecipeCategories = require('../models/recipeCategoryModel');
const Products = require('../models/products');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const jcc = require('json-case-convertor');
const priceCalculateModule = require("./BusinessModules/ProductModules/priceCalculateModule");


const showHomePage = async (req, res, next) => {

    try {

        
        res.render('admin/homePage', { layout: '../layouts/adminHome_Layout', title: `Admin | IG Priv`, description: ``, keywords: `` })


    } catch (err) {
        console.log(err);
    }
};
const showProductPage = async (req, res, next) => {
    try {
        const categories = await ProductCategories.find();
        res.render('admin/addproduct', { layout: '../layouts/free', title: `Product ADD`, description: ``, keywords: ``, categories })
    }
    catch (err) {
        console.log(err)
    }
}
const showRecipePage = async (req, res, next) => {
    try {
        const ingredients = await FoodIngredients.find({ active: "1" })
        const categories = await RecipeCategories.find();


        res.render('admin/addFoodRecipe', { layout: '../layouts/free', title: `Product ADD`, description: ``, keywords: ``, ingredients, categories })
    }

    catch (err) {
        console.log(err)
    }
}
//Post

const postFoodIngredients = async (req,res,next) => {
    try{
        const SpecialID = await ids.find({active: "1"})
        console.log(SpecialID)
        const informations = {

            Ingredients_Name: req.body.product_name,
            Ingredients_MainCategory: req.body.topic,
            Ingredients_SubCategory: req.body.chapter,
            Ingredients_Type: req.body.typeofIngredients,
            Ingredients_ID: req.body.product_id,
            Ingredients_SubName: req.body.product_subname,
            Ingredients_Weight: req.body.product_weight,
            Ingredients_Note: req.body.product_description,
            Ingredients_Photo: req.file.filename,
            Ingredients_Active: 1,
            Ingredients_SpecialID: SpecialID[0].Ingredients_CustomID+1
        }
        const newProduct = new FoodIngredients(
            informations,
            
        );
        await newProduct.save();
        res.redirect('../admin/addproduct');
        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
        const UpdateID = {
            Ingredients_CustomID : SpecialID[0].Ingredients_CustomID+1
        }

        await ids.findByIdAndUpdate(SpecialID[0]._id, UpdateID);
    }
    catch(err){
        console.log(err)
    }
}
const postfoodRecipe = async (req, res, next) => {
    try {
        const {
            product_name,
            recipeCategory,
            product_description,
            video
        } = req.body;

        let price = 0;
        const foodIngredients = JSON.parse(req.body.foodIngredients);
        const photos = req.files.photos;
        console.log(req.files)
        const ingredients = await Promise.all(foodIngredients.map(async (ingredient) => {
            const productFind = await Products.find({$and:[{product_name: {"$regex": ingredient.subname, $options: 'i' }},{product_category: {"$regex": ingredient.category, $options: 'i' }}]});
            const costOfProduct = await priceCalculateModule.getCostOfProduct(jcc.upperCaseValues(productFind), ingredient.Ingredients_Weight, 1).averagePrice;
            if (costOfProduct !== null) {
                price += costOfProduct;
              }
            return {
              subname: ingredient.Ingredients_SubName,
              weight: ingredient.Ingredients_Weight,
              category: ingredient.Ingredients_SubCategory,
              name: ingredient.Ingredients_Name,
              quantity: ingredient.quantity
            };
          }));
          

        const informations = {
            Recipe_Name: product_name,
            Recipe_Description: product_description,
            Recipe_Category: recipeCategory,
            Recipe_Video: video,
            Recipe_Ingredients: ingredients,
            Recipe_photo: photos,
            Recipe_Price: price,
            Ingredients_Active: "1"
        };

        const newProduct = new foodRecipes(informations);
        await newProduct.save();
        res.redirect('../admin/recipe');
        console.log(product_name + ' başarı ile veritabanına eklendi.');
    } catch (err) {
        console.log(err);
    }
};


module.exports = {
    showHomePage,
    showProductPage,
    showRecipePage,
    postFoodIngredients,
    postfoodRecipe

}