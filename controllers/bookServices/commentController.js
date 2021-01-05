const { ObjectId} = require('mongodb');

const bookModel = require('../../models/bookModel');
const userModel = require('../../models/userModel');

exports.index = async (req, res, next) =>{
    const bookID = req.params.id;
    const book = await bookModel.get(bookID);
    //const comment = book.comment ? book.comment : [];

   
    
     // tính toán phân trang bình luận
     const perpage = 5;
     const current = parseInt(req.query.page) || 1;
     const comment = await bookModel.listcomment(bookID, current, perpage);
     const count_comment = book.comment.length || 0;    
     const pages = Math.ceil(count_comment/perpage); 
     const nextPage = current < pages ? (current+1): current;
     const prevPage = current > 1 ? (current-1): 1;
     const hasNextPage = current < pages;  
     const hasPreviousPage = current > 1;
 
     if (comment)
    {
        for (var id in comment)
        {
           comment[id].bookID = bookID;
        }
    }

    res.render ('books/listcomment',{
        title: "Chi tiết bình luận", 
        bookID,
        comment,
        current,
        nextPage,
        prevPage,
        totalComments: count_comment,
        pages,
        hasNextPage,
        hasPreviousPage,
        lastPage: pages,});
};

exports.add_comment = async(req, res, next) => {
    const bookID = req.params.id;
    const nickname = "Quản trị viên";
    const content = req.body.content;
    
    const book = await bookModel.get(bookID);
    const comment = book.comment ? book.comment : [];
    const cmt = {nickname: nickname, content: content};
    comment.push(cmt);
    await bookModel.add_comment(bookID, comment);

    res.redirect('../view_comment/' + bookID);
};

exports.delete_comment = async (req, res, next) => {
    const bookID = req.params.id;
    const index = req.params.index;

    const book = await bookModel.get(bookID);
    const comment = book.comment ? book.comment : [];

    comment.splice(index,1);
    await bookModel.add_comment(bookID, comment);

    res.redirect('../../view_comment/' + bookID);
};