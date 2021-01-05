
const userModel = require('../models/userModel');

const item_per_page = 10;
exports.index = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search;
    const filter = {};

    if (search)
    {
        filter.username= new RegExp(search, 'i');
    }
    
    const paginate = await userModel.listuser(filter,page,item_per_page);
   
    res.render('./users/listuser', {
        title: "Người dùng",
        users: paginate.docs,
        totalUsers: paginate.totalDocs,
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

exports.view_user = async (req, res, next) => {
    const user = await userModel.get(req.params.id);
    res.render('users/user_detail',{title: 'Thông tin người dùng', user } );
};

exports.block = async (req, res, next) => {
    const userID = req.params.id;
    await userModel.update_status(userID,"Blocked");
    res.redirect('../view/' + userID );
};

exports.unblock = async (req, res, next) => {
    const userID = req.params.id;
    await userModel.update_status(userID,"Normal");
    res.redirect('../view/' + userID );
};