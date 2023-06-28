const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    
      subCategory: [{
        type: String,
        trim: true
      }]
    
}, { collection: 'ProductCategories' });

const Admin = mongoose.model('ProductCategory', UserSchema);

module.exports = Admin;
