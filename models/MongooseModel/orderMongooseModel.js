const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const {Schema} = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const order = new Schema(
{
    userID: ObjectId,
    username: String,
    firstName: String,
    lastName:  String,
    phone: String,
    district: String,
    ward: String,
    city: String,
    address: String,
    status: String,
    totalOrder: String,
    cart: Object
},
  {collection: 'Orders'}
  );

  order.plugin(mongoosePaginate);
  module.exports = mongoose.model('Orders', order);