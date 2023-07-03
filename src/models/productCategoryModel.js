const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  category: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    trim: true
  }
}, { collection: 'ProductCategories' });

const CategoryModel = mongoose.model('ProductCategory', CategorySchema);

module.exports = CategoryModel;
