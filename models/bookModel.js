//const {db} = require('../dal/db');
const { ObjectId} = require('mongodb');
const booksCollection = require('./MongooseModel/bookMongooseModel');
const categoryCollection = require ('./MongooseModel/categoryMongooseModel');
function showUnsignedString(search) {
    var signedChars = "àảãáạăằẳẵắặâầẩẫấậđèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬĐÈẺẼÉẸÊỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢÙỦŨÚỤƯỪỬỮỨỰỲỶỸÝỴ";
    var unsignedChars = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAADEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYY";
    var input = search;
    var pattern = new RegExp("[" + signedChars + "]", "g");
    var output = input.replace(pattern, function(m, key, value) {
        return unsignedChars.charAt(signedChars.indexOf(m));
    });
    return output;
};

exports.listcategory = async () => {
    //console.log('model db');
    //const booksCollection = db().collection('Books');
    const cat = await categoryCollection.find({});
    return cat;
};

exports.get_name_cat = async (id) => {
    const nameCat = await categoryCollection.findOne({_id: ObjectId(id)});
    return nameCat.catogory;
};
exports.listbook = async (filter, pageNumber, itemPerPage) => {
    //const booksCollection = db().collection('Books');
    let books = await booksCollection.paginate(filter,{
        page: pageNumber,
        limit: itemPerPage,
    });
    return books;
};

exports.listbookTop10 = async(filter) => {
    let books = await booksCollection.paginate(filter, {
        page: 1,
        limit: 10,
        sort: { saleNumber: -1 },
    });
    return books;
}

exports.post_add = async (req) => {

    const {txtTitle, txtImagePath, txtDescription, txtDetail, txtOldPrice, txtBasePrice, 
        txtAuthor, txtCategory, txtImageList, txtStatus, txtStoreNumber} = req; 
    const hasCategory = await categoryCollection.findOne({catogory: txtCategory});

    if (!hasCategory)
    {
        await categoryCollection.create({catogory: txtCategory});
    }
   
    const catid = await categoryCollection.findOne({catogory: txtCategory});
    // SQL Query > Insert Data
    await booksCollection.create(
    {   
        cover: txtImagePath, 
        listCover: txtImageList,
        title: txtTitle, 
        descript: txtDescription, 
        detail: txtDetail, 
        oldPrice: txtOldPrice,
        basePrice: parseInt(txtBasePrice),
        catID: ObjectId (catid._id),
        author: txtAuthor,
        catogory: txtCategory,
        isDeleted: false,
        status: txtStatus,
        unsigned_title: showUnsignedString(txtTitle),
        storeNumber: txtStoreNumber,
        saleNumber: 0
    })
};

exports.post_update = async (req,id) => {
    //const booksCollection = db().collection('Books');
    const {txtTitle, txtImagePath, txtDescription, txtDetail, txtOldPrice, txtBasePrice, 
        txtAuthor, txtCategory, txtImageList, txtStatus, txtStoreNumber} = req; 
    const hasCategory = await categoryCollection.findOne({catogory: txtCategory});

    if (!hasCategory)
    {
        await categoryCollection.create({catogory: txtCategory});
    }

    const catid = await categoryCollection.findOne({catogory: txtCategory});
    // SQL Query > Insert Data
    await booksCollection.updateOne(
        { _id: ObjectId(id) },
        {   
            cover: txtImagePath, 
            listCover: txtImageList,
            title: txtTitle, 
            descript: txtDescription, 
            detail: txtDetail, 
            oldPrice: txtOldPrice,
            catID: ObjectId (catid._id),
            author: txtAuthor,
            catogory: txtCategory,
            status: txtStatus,
            basePrice: parseInt(txtBasePrice), 
            storeNumber: txtStoreNumber,
        })
};

exports.delete = async (id) => {
    //const booksCollection = db().collection('Books');
    await booksCollection.update({_id: ObjectId(id)}, {isDeleted: true})
};


exports.get = async (id) => {
    //const booksCollection = db().collection('Books');
    const book = await booksCollection.findOne({_id: ObjectId(id)});
    return book;
};

exports.get_name_book = async (title) => {
    //const booksCollection = db().collection('Books');
    const book = await booksCollection.findOne({unsigned_title: title});
    return book;
};

exports.add_comment = async (id, cmt) => {

    await booksCollection.updateOne(   
        {_id: ObjectId(id)},
        {comment: cmt}
    )
};

exports.listcomment = async (bookID, page, perPage) => {

    const arr_comment = await booksCollection.findOne({ _id: ObjectId(bookID) }).select("comment");
    const comment = arr_comment.comment.slice(perPage * (page-1), perPage*page);
    return comment;
}


