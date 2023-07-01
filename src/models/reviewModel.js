const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  reviewer: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
