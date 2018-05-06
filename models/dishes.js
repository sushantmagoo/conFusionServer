const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

//commentSchema for document
var commentSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

//dishSchema is Schema for our document
var dishSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    price: {
      type: Currency,
      required: true,
      min: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    comments: [commentSchema]
  },
  {
    timestamps: true
  }
);

//DishCollection is name of Collection,
//Its plural 'dishcollections' (all in lowercase) will be used to name MongoDB collection.
var DishesModel = mongoose.model('DishCollection', dishSchema);
//Name of Model we are exporting to be used outside.
module.exports = DishesModel;
