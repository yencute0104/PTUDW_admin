//const { MongoClient } = require("mongodb");
//

const mongoose = require('mongoose');
const uri = process.env.URI || "mongodb+srv://nganyen:123@cluster0.qwbft.mongodb.net/PTUDW_BookStore";
//"mongodb+srv://nganyen:123@cluster0.qwbft.mongodb.net/test?authSource=admin&replicaSet=atlas-itiptg-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
// Create a new MongoClient
//const client = new MongoClient(uri, { useUnifiedTopology: true });

//let database;

// async function connectDb(){
//     await client.connect();
//     // Establish and verify connection
//     database = await client.db("PTUDW_BookStore");
//     console.log('Db connected!');
// }
// console.log('RUNNING DB...');

// connectDb();

// const db = () => database;

// const booksCollection = database.collection('Books');
// booksCollection.plugin(mongoosePaginate);

// module.exports.db = db;

exports.mongoose = async () => {
    try {
        await mongoose.connect( uri, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true});

        console.log("DB is connected");    
        }
    catch (error) 
        { 
            console.error("Can't connect to DB");    
        }
}

//const filter = {};

// MongoClient.connect(
//   'mongodb+srv://nganyen:123@cluster0.qwbft.mongodb.net/test?authSource=admin&replicaSet=atlas-itiptg-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   function(connectErr, client) {
//     assert.equal(null, connectErr);
//     const coll = client.db('PTUDW_BookStore').collection('Books');
//     coll.find(filter, (cmdErr, result) => {
//       assert.equal(null, cmdErr);
//     });
//     client.close();
//   });