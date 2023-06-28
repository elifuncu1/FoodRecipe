const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    
      name: [{
        type: String,
        trim: true
      }]
    
}, { collection: 'recipeCategories' });

const Admin = mongoose.model('recipeCategories', UserSchema);

module.exports = Admin;
