const mongoose = require('mongoose');
const {Schema} = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const user = new Schema(
{
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    profilePic: String,
    cart: Object,
    status: String
},
  {collection: 'Users'}
  );

  user.plugin(mongoosePaginate);
  module.exports = mongoose.model('Users', user);