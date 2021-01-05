const app = require('../app');
const express = require('express');
const router = express.Router();

/* GET home page. */
const listController = require('../controllers/bookServices/listController');
const updateController = require('../controllers/bookServices/updateController');
const commentRouter = require('../routes/comment');

router.get('/',checkAuthentication, listController.index);

router.get('/addbook', checkAuthentication, function(req, res, next) {

      res.render('../views/books/addbook',{title:'Thêm sách'})
  });

router.post('/addbook', listController.add) ;

router.get('/update/:id',checkAuthentication, updateController.index);

router.post('/update/:id', listController.update) ;

router.get('/delete/:id',checkAuthentication, listController.delete);

router.use('/view_comment',checkAuthentication, commentRouter);
router.use('/delete_comment',checkAuthentication, commentRouter);

router.get('/top10', checkAuthentication, listController.top10);

function checkAuthentication(req,res,next){
  if(req.isAuthenticated()){
      next();
  } else{
      res.redirect("/");
  }
};

module.exports = router;