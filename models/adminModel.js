
const { ObjectId} = require('mongodb');
const bcrypt = require('bcrypt');

const adminCollection = require('./MongooseModel/adminMongooseModel');
// exports.check =  async (req) => {
//     const username = await req.body.txtUsername;
//     const password = await req.body.txtPassword;
//     if (username==="admin" && password==="123")
//         return true;
//     else
//         return false;
// }

exports.check = async(username, password) => {
    console.log(username);
    console.log(password);
    const user = await adminCollection.findOne({username: username});
    if (user)
    {
        let checkPassword = (password === user.password); 

        console.log(user.password);
        console.log(password);
    
        if (checkPassword)
            return user;

        return false;
    }
    //let checkPassword = await bcrypt.compare(password, user.password); 
   
    return false;
};

exports.getAdmin = (id) => {
    return adminCollection.findOne({_id: id});
};


exports.update_profile = async (req,id) => {
    const {txtFirstName, txtLastName, txtEmail, txtProfilePic, txtPhone} = req;

    await adminCollection.update(
        {_id: ObjectId(id)},
        {
            firstName: txtFirstName,
            lastName : txtLastName,
            email : txtEmail,
            profilePic : txtProfilePic,
            phone : txtPhone,
        }
    )
}

exports.change_password = async (username, newPassword) => {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(newPassword, salt, function(err, hash) {
            let user = adminCollection.updateOne(
                {username: username},
                {password: hash}
                
            );
            user
            .update()
            .then((doc)=>{})
            .then((err)=>{
                console.log(err);
            });
        });
    });
    return;
}

/**
 * Check for valid username and password, return user info if valid
 * @param {*} username 
 * @param {*} password 
 */
exports.checkCredential = async(username, password) => {
    const user = await adminCollection.findOne({username: username});
    if (!user)
        return false;
    let checkPassword = await bcrypt.compare(password, user.password); 
    if (checkPassword)
        return user;
    return false;
};