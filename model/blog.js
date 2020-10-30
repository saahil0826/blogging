var mongoose = require("mongoose");

//model config
var blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: String,
  body: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});
var Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
