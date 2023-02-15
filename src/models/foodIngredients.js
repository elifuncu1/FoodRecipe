const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    Ingredients_Name: {
        type: String,
        trim: true
    },
    Ingredients_SubName: {
        type: String,
        trim: true
    },
    Ingredients_MainCategory: {
        type: String,
        trim: true
    },
    Ingredients_SubCategory: {
        type: String,
        trim: true
    },
    Ingredients_Type: {
        type: String,
        trim: true
    },
    Ingredients_Weight: {
        type: String,
        trim: true
    },
    Ingredients_ID: {
        type: String,
        trim: true
    },
    Ingredients_Note: {
        type : String,
        trim : true
    },
    Ingredients_Photo: {
        type : String,
        trim : true
    },
    Ingredients_Active: {
        type : Number,
        trim : true
    },
    Ingredients_SpecialID: {
        type: Number,
        trim: true
    }
   
}, { collection: 'FoodIngredients',locale: 'tr', timestamps: true });

const Admin = mongoose.model('FoodIngredients', UserSchema);

module.exports = Admin;
