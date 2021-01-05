const { ObjectId} = require('mongodb');
const userCollection = require('./MongooseModel/userMongooseModel');

exports.listuser = async (filter, pageNumber, itemPerPage) => {
   
    let users = await userCollection.paginate(filter,{
        page: pageNumber,
        limit: itemPerPage,
    });
    return users;
};

exports.get = async (id) => {
    //const usersCollection = db().collection('users');
    const user = await userCollection.findOne({_id: ObjectId(id)})
    return user;
};

exports.update_status = async (id,status) => {
    await userCollection.updateOne({_id: ObjectId(id)}, {status: status});
};

exports.getProfilePicUser = async(username)=>{
    const user = await userCollection.findOne({username: username});
    if (user)
        return user.profilePic;
    else 
        return null;
}