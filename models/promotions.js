const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

//Schema for Promotion Model
var promoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    image: {
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
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

//Exporting the Model 'Promotion' as Module
module.exports = mongoose.model('Promotion', promoSchema);
