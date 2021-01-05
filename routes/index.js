const express = require('express');
const app = require('../app');
const router = express.Router();

/* GET home page. */
const listController = require('../controllers/bookServices/listController');
const updateController = require('../controllers/bookServices/updateController');
const adminController = require('../controllers/adminController');
const listbookRouter = require('../routes/listbook');
const listuserRouter = require('../routes/listuser');
const listorderRouter = require('../routes/listorder');
const { check } = require('express-validator');

/* GET list of books. */
router.get('/', checkAuthentication,  function(req, res, next){
  res.render('index',{title: 'Trang chủ'});
});

router.get('/profile/:id', checkAuthentication, adminController.profile);
router.post('/profile/:id', checkAuthentication, adminController.update_profile);

router.get('/change_password/:id', checkAuthentication, adminController.change_password_page);
router.post('/change_password/:id', checkAuthentication, adminController.change_password);

router.use('/listbook', listbookRouter);
router.use('/listuser', listuserRouter);
router.use('/listorder', listorderRouter);

//router.post('/delete/:id', listController.delete);
function checkAuthentication(req,res,next){
  if(req.isAuthenticated()){
      //req.isAuthenticated() will return true if user is logged in
      next();
  } else{
      res.redirect("/");
  }
}
module.exports = router;
