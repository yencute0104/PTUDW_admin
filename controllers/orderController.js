const orderModel = require('../models/orderModel');

const item_per_page = 10;
exports.index = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search;
    const status = parseInt(req.query.status) || 0 ;
    const nameStatus = ["Tất cả","Đợi duyệt", "Đang giao", "Đã giao", "Hủy"];
    console.log(status);
    const filter = {};

    if (status)
    {
        filter.status = nameStatus[status];
    }
    if (search)
    {
        filter.username = new RegExp(search, 'i');
    }
    
    const paginate = await orderModel.listorder(filter,page,item_per_page);
   
    res.render('orders/listorder', {
        title: "Đơn hàng",
        orders: paginate.docs,
        totalOrders: paginate.totalDocs,
        nameSearch: search,
        nameStatus: nameStatus[status],
        hasNextPage: paginate.hasNextPage,
        nextPage: paginate.nextPage,
        hasPreviousPage: paginate.hasPrevPage,
        prevPage: paginate.prevPage,
        lastPage: paginate.totalPages,
        ITEM_PER_PAGE: item_per_page,
        currentPage: paginate.page,
    });
};

exports.view_order = async (req, res, next) => {
    const orderID = req.params.id;
    const order = await orderModel.get(orderID);
    const address = order.address +', ' + order.ward + ', ' + order.district + ', ' + order.city;

    const waiting = order.status === "Đợi duyệt";
    const delivering = order.status === "Đang giao";
       
    res.render('orders/order_detail', {title: 'Chi tiết đơn hàng', order, address, waiting, delivering});
};

exports.tick = async (req, res, next) => {
    const orderID = req.params.id;
    const order = await orderModel.get(orderID);
    console.log(order.status); 
    if (order.status == "Đợi duyệt")
        await orderModel.update_status(orderID, "Đang giao");
    else if (order.status == "Đang giao")
        await orderModel.update_status(orderID, "Đã giao");
    res.redirect('../view/' + orderID);
};

exports.cancel = async (req, res, next) => {
    const orderID = req.params.id;
    await orderModel.cancelOrder(orderID);
    res.redirect('../view/' + orderID);
};