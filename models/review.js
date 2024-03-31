const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./product");

const reviewSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  product: { type: Schema.Types.ObjectId, ref: "Product" },
});
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
