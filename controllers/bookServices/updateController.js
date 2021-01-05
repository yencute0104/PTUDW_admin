const { render } = require('../../app');
const bookModel = require('../../models/bookModel');

exports.index = async (req, res, next) => {
    const book = await bookModel.get(req.params.id);
    res.render('books/updatebook',{title: 'Chỉnh sửa', book } );
};