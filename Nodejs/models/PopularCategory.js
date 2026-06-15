const mongoose = require('mongoose');

const PopularCategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model('PopularCategory', PopularCategorySchema, 'popular_categories');
