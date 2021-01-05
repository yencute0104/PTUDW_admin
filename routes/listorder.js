const app = require('../app');
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', checkAuthentication, orderController.index);
router.get('/view/:id',checkAuthentication, orderController.view_order);
router.get('/tick/:id', checkAuthentication, orderController.tick);
router.get('/cancel/:id', checkAuthentication, orderController.cancel);

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/");
    }
};

module.exports = router;