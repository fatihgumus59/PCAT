const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotosSchema = new Schema({
  title: String,
  description: String,
  image: String,
  dataCreated: {
    type: Date,
    default: Date.now,
  },
});

const Photos = mongoose.model('Photo', PhotosSchema);

module.exports = Photos;
