const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    Recipe_Name: {
        type: String,
        trim: true
    },
    Recipe_Description: {
        type: String,
        trim: true
    },
    Recipe_Ingredients: {
        type: [{
            name: String,
            subname:String,
            weight : Number,
            category : String,
            quantity: Number
        }]
    },
    Recipe_photo: {
        type: String,
        trim: true
    },
    Recipe_Category: {
        type: String
    },
    Recipe_Video: {
        type: String
    },
    Recipe_Like: {
        type: Number
    },
    Recipe_UnLike: {
        type: Number
    },
    Recipe_Price: {
        type: Number
    },
    Recipe_Owner: {
        type: String
    }
}, { 
    collection: 'foodRecipes',
    locale: 'tr',
    timestamps: true 
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;
