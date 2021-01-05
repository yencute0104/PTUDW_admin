const app = require('../app');
const express = require('express');
const router = express.Router();

/* GET home page. */
const listController = require('../controllers/bookServices/listController');
const userController = require('../controllers/userController');

router.get('/',checkAuthentication, userController.index);
router.get('/view/:id',checkAuthentication, userController.view_user);
router.get('/block/:id', checkAuthentication, userController.block);
router.get('/unblock/:id', checkAuthentication, userController.unblock);

function checkAuthentication(req,res,next){
  if(req.isAuthenticated()){
      next();
  } else{
      res.redirect("/");
  }
};

module.exports = router;