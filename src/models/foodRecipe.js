const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    Recipe_Name: {
        type: String,
        trim: true
    },
    Recipe_Description: {
        type: String,
        trim: true
    },
    Recipe_Ingredients: {
        type: String,
        trim: true
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
    Recipe_Like:{
        type: Number
    },
    Recipe_UnLike:{
        type: Number
    },
    Recipe_Price:{
        type: Number
    },
    Recipe_Owner:{
        type: String
    },
    
}, { collection: 'foodRecipes',locale: 'tr', timestamps: true });

const Admin = mongoose.model('foodRecipes', UserSchema);

module.exports = Admin;