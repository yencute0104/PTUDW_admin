const { ObjectId} = require('mongodb');
const orderCollection = require('./MongooseModel/orderMongooseModel');
const bookCollection = require('./MongooseModel/bookMongooseModel');

exports.listorder = async (filter, pageNumber, itemPerPage) => {
   
    let orders = await orderCollection.paginate(filter,{
        page: pageNumber,
        limit: itemPerPage,
    });
    return orders;
};

exports.get = async (id) => {
    const order = await orderCollection.findOne({_id: ObjectId(id)})
    return order;
};

exports.update_status = async (id,status) => {
    const order = await orderCollection.findOne({ _id: ObjectId(id) });
    await orderCollection.updateOne({_id: ObjectId(id)}, {status: status});
};

exports.cancelOrder = async (id) => {
    const order = await orderCollection.findOne({ _id: ObjectId(id) });
    const listCart = order.cart.items;
    for (var index in listCart) {
        const book = await bookCollection.findOne({ _id: ObjectId(listCart[index].item._id) });
        const storeNumber = book.storeNumber + listCart[index].qty;
        const saleNumber = book.saleNumber - listCart[index].qty;
        await bookCollection.updateOne({ _id: ObjectId(listCart[index].item._id) }, {
            storeNumber: storeNumber,
            saleNumber: saleNumber
        })
    }
    await orderCollection.updateOne({_id: ObjectId(id)}, {status: "Hủy"});
}