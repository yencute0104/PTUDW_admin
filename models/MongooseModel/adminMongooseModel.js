const mongoose = require('mongoose');
const {Schema} = mongoose;

const admin = new Schema(
{
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    profilePic: String,
},
  {collection: 'Admin'}
  );

  module.exports = mongoose.model('Admin', admin);