const { render } = require('../../app');
const { ObjectId} = require('mongodb');
const formidable = require('formidable');

const cloudinary = require('cloudinary').v2;

const bookModel = require('../../models/bookModel');

const item_per_page = 10;
function showUnsignedString(search) {
    var signedChars = "àảãáạăằẳẵắặâầẩẫấậđèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬĐÈẺẼÉẸÊỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢÙỦŨÚỤƯỪỬỮỨỰỲỶỸÝỴ";
    var unsignedChars = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAADEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYY";
    var input = search;
    var pattern = new RegExp("[" + signedChars + "]", "g");
    var output = input.replace(pattern, function(m, key, value) {
        return unsignedChars.charAt(signedChars.indexOf(m));
    });
    return output;
}
exports.index = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search;
    var nameCat =  "Tất cả";
    var catid = req.query.catid;
    if (catid)
    {
        var catID =  ObjectId(catid);
        var tmp_nameCat = await bookModel.get_name_cat(catid);
    }
    if (tmp_nameCat)
       nameCat = tmp_nameCat;
    const filter = {};
    if (catid)
    {
        if (nameCat != "Tất cả")
            filter.catID = ObjectId(catid);
    }
    if (search)
    {
        filter.unsigned_title= new RegExp(showUnsignedString(search), 'i');
    }

    filter.isDeleted =  false;
    
    const paginate = await bookModel.listbook(filter,page,item_per_page);
    const category =  await bookModel.listcategory();
    res.render('./books/listbook', {
        title: "Sách",
        books: paginate.docs,
        totalBooks: paginate.totalDocs,
        category,
        nameCat,
        catID,
        nameSearch: search,
        hasNextPage: paginate.hasNextPage,
        nextPage: paginate.nextPage,
        hasPreviousPage: paginate.hasPrevPage,
        prevPage: paginate.prevPage,
        lastPage: paginate.totalPages,
        ITEM_PER_PAGE: item_per_page,
        currentPage: paginate.page,
    });
};

exports.top10 = async(req, res, next) => {
    const filter = {};
    filter.isDeleted = false;
    const paginate = await bookModel.listbookTop10(filter);

    res.render('books/top10', {
        title: 'Thống kê',
        books: paginate.docs,
    });
};
exports.add = async (req, res, next) => {
    
    const form = formidable({ multiples: true });
    var arr = [];
   
    form.parse(req, async (err, fields, files) => 
    {
        if (err) {
          next(err);
          return;
        }

        const {txtTitle, txtImagePath, txtDescription, txtDetail, txtOldPrice, txtBasePrice, 
            txtAuthor, txtCategory, txtImageList, txtStatus, txtStoreNumber} = fields; 

        // ràng buộc tên sách là duy nhất
        const title = await bookModel.get_name_book(showUnsignedString(txtTitle));       
        if (title)
        {
            return res.render('books/addbook',{
                title: "Thêm sách", 
                messageTitle: "Tên sách đã tồn tại, vui lòng vào update!",
                txtTitle, txtImagePath, txtDescription, 
                txtDetail, txtOldPrice, txtBasePrice, 
                txtAuthor, txtCategory, txtImageList, txtStatus
            });
        }

        const coverImage = files.txtImagePath;
        const listCover = files.txtImageList;
        const imageType = ["image/png", "image/jpeg"];

        // ảnh bìa phải là 1 file ảnh
        if (coverImage && coverImage.size > 0 && (imageType.indexOf(coverImage.type) >=0 ) ) 
        {
            // là 1 mảng file
            if (listCover.length>0)
            {
                // phát hiện 1 file không phải ảnh
                for (var index in listCover)
                    if (imageType.indexOf(listCover[index].type) === -1 )
                        return res.render('books/addbook',{
                            title: "Thêm sách", 
                            messageImage: "Chỉ được chọn ảnh",
                            txtTitle, txtImagePath, txtDescription, 
                            txtDetail, txtOldPrice, txtBasePrice, 
                            txtAuthor, txtCategory, txtImageList, txtStatus, txtStoreNumber
                        });

                // mảng toàn file ảnh
                for (var index in listCover)
                {
                    cloudinary.uploader.upload(listCover[index].path,function(err,result){                   
                        arr.push(result.url);
                    }).then(() => { 

                        if (arr.length === listCover.length)
                        {
                            cloudinary.uploader.upload(coverImage.path, function(err, result){
                                fields.txtImagePath = result.url;
                                fields.txtImageList = arr;
                                bookModel.post_add(fields).then(()=>{
                                    res.render('books/addbook',{title: "Thêm sách", message: "Thêm sách thành công"});
                                })
                            })
                        }
                    
                    });
                                    
                    
                }
            }
            else  // là 1 file
            {
                // ko phải file ảnh
                if (imageType.indexOf(listCover.type) === -1 )
                        return res.render('books/addbook',{
                            title: "Thêm sách", 
                            messageImage: "Chỉ được chọn ảnh",
                            txtTitle, txtImagePath, txtDescription, 
                            txtDetail, txtOldPrice, txtBasePrice, 
                            txtAuthor, txtCategory, txtImageList, txtStatus, txtStoreNumber
                        });
                
                // là file ảnh
                cloudinary.uploader.upload(listCover.path,function(err,result){                   
                    fields.txtImageList = result.url;
                    cloudinary.uploader.upload(coverImage.path, function(err, result){
                        fields.txtImagePath = result.url;
                        bookModel.post_add(fields).then(()=>{
                            res.render('books/addbook',{title: "Thêm sách", message: "Thêm sách thành công"});
                        })
                    })
                })
            }
        }
        else
        {
            // ko phải file ảnh
            return res.render('books/addbook',{
                title: "Thêm sách", 
                messageImage: "Chỉ được chọn ảnh",
                txtTitle, txtImagePath, txtDescription, 
                txtDetail, txtOldPrice, txtBasePrice, 
                txtAuthor, txtCategory, txtImageList, txtStatus, txtStoreNumber
            });
        }
    });
};

exports.update = async (req, res, next) => {
    const form = formidable({ multiples: true });
    var arr = [];
    const book = await bookModel.get(req.params.id);

    form.parse(req, async (err, fields, files) => {
        if (err) {
          next(err);
          return;
        }

        const coverImage = files.txtImagePath;
        const listCover = files.txtImageList;
        const imageType = ["image/png", "image/jpeg"];

        if (coverImage && coverImage.size > 0 ) 
        {
            if (imageType.indexOf(coverImage.type) ===-1 )
                return res.render('books/updatebook',{
                    title: "Chỉnh sửa", 
                    messageImage: "Chỉ được chọn ảnh",
                    book
                });

            cloudinary.uploader.upload(coverImage.path,function(err, result){
            fields.txtImagePath = result.url;}).then(()=>
            {           
                
                if (listCover.length>0)
                {
                     // phát hiện 1 file không phải ảnh
                    for (var index in listCover)
                    if (imageType.indexOf(listCover[index].type) === -1 )
                        return res.render('books/updatebook',{
                            title: "Chỉnh sửa", 
                            messageImage: "Chỉ được chọn ảnh",
                            book
                        });

                    for (var index in listCover)
                    {
                        cloudinary.uploader.upload(listCover[index].path, function(err, result){
                            arr.push(result.url);
                            }).then(()=>{
                                if (listCover.length === arr.length)
                                {
                                    fields.txtImageList = arr;
                                    bookModel.post_update(fields,req.params.id).then(()=>{
                                        res.redirect('../../listbook');
                                        });
                                }
                            })
                    }

                }
                else if (listCover.size > 0 )
                {
                    if (imageType.indexOf(listCover.type) === -1 )
                        return res.render('books/updatebook',{
                            title: "Chỉnh sửa", 
                            messageImage: "Chỉ được chọn ảnh",
                            book
                        });
                    cloudinary.uploader.upload(listCover.path, function(err, result){
                        fields.txtImageList = result.url;
                        bookModel.post_update(fields,req.params.id).then(()=>{
                            res.redirect('../../listbook');
                            });
                    })
                }
               
                else 
                {
                    consosle("3");
                    bookModel.post_update(fields,req.params.id).then(()=>{
                        res.redirect('../../listbook');
                        });
                }
            });
        }
        else
        {
            
            if (listCover.length > 0)
            {
                  // phát hiện 1 file không phải ảnh
                  console.log("0");
                  for (var index in listCover)
                  if (imageType.indexOf(listCover[index].type) === -1 )
                      return res.render('books/updatebook',{
                          title: "Chỉnh sửa", 
                          messageImage: "Chỉ được chọn ảnh",
                          book
                      });

                    
                      for (var index in listCover)
                      {
                          cloudinary.uploader.upload(listCover[index].path, function(err, result){
                              arr.push(result.url);
                              }).then(()=>{
                                  if (listCover.length === arr.length)
                                  {
                                      fields.txtImageList = arr;
                                      bookModel.post_update(fields,req.params.id).then(()=>{
                                          res.redirect('../../listbook');
                                          });
                                  }
                              })
                      }
            }
               
            else if (listCover.size > 0)
            {
                console.log("1");
                if (imageType.indexOf(listCover.type) === -1 )
                        return res.render('books/updatebook',{
                            title: "Chỉnh sửa ", 
                            messageImage: "Chỉ được chọn ảnh",
                            book
                        });

                cloudinary.uploader.upload(listCover.path, function(err, result){
                    fields.txtImageList = result.url;
                    bookModel.post_update(fields,req.params.id).then(()=>{
                        res.redirect('../../listbook');
                        });
                })
            }
           
            else 
            {
                console.log("2");
                bookModel.post_update(fields,req.params.id).then(()=>{
                    res.redirect('../../listbook');
                    });
            }
        }
        //const books = await bookModel.list();
        
    });
   
};

exports.delete = async (req, res, next) => {
    // Get books from model
    await bookModel.delete(req.params.id);
    //const books = await bookModel.list();
    res.redirect('../../listbook');
};