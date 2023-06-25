const FoodIngredients = require('../models/foodIngredients');
const foodRecipes = require('../models/foodRecipe');
const ids = require('../models/ids');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const showHomePage = async (req, res, next) => {

    try {


        res.render('admin/homePage', { layout: '../layouts/adminHome_Layout', title: `Admin | IG Priv`, description: ``, keywords: `` })


    } catch (err) {
        console.log(err);
    }
};
const showProductPage = async (req,res,next) => {
    try{
        res.render('admin/addproduct',{ layout: '../layouts/free', title: `Product ADD`, description: ``, keywords: `` })
    }
    catch(err){
        console.log(err)
    }
}
const showRecipePage = async (req,res,next) => {
    try{
        const FoodIngredient = await FoodIngredients.find({active: "1"})
        
        const NameAndIds = [] 
        const IngredientNames = []

        for( let index = 0; index < FoodIngredient.length; index++ ) { 
            NameAndIds.push(FoodIngredient[index].Ingredients_Name+':'+FoodIngredient[index].Ingredients_ID)
            IngredientNames.push(FoodIngredient[index].Ingredients_Name)

        } 
        res.render('admin/addFoodRecipe',{ layout: '../layouts/free', title: `Product ADD`, description: ``, keywords: ``,IngredientNames,NameAndIds  })
    }
    
    catch(err){
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
            Ingredients_ID: uuidv4(),
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
        res.redirect('../izzycode/addproduct');
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
const postfoodRecipe = async (req,res,next) => {
    try{
        const informations = {

            Recipe_Name: req.body.product_name,
            Recipe_Description: req.body.product_description,
            Recipe_Ingredients: [],
            Recipe_photo: req.file.filename,
            Ingredients_Active: "1"

        }
        
        const newProduct = new foodRecipes(
            informations,
            
        );
        await newProduct.save();
        res.redirect('../izzycode/recipe');
        console.log(req.body.product_name+' başarı ile veritabanına eklendi.')
    }
    catch(err){
        console.log(err)
    }
}

module.exports = {
    showHomePage,
    showProductPage,
    showRecipePage,
    postFoodIngredients,
    postfoodRecipe

}