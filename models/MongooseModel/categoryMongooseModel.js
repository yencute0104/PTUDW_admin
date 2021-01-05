const mongoose = require('mongoose');
const {Schema} = mongoose;

const category = new Schema(
{
    catogory: String
},
  {collection: 'Catogory'}
  );

  module.exports = mongoose.model('Catogory', category);