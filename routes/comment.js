const express = require('express');
const app = require('../app');
const router = express.Router();

const commentController = require('../controllers/bookServices/commentController');

router.get('/:id', checkAuthentication,commentController.index);
router.post('/:id', checkAuthentication,commentController.add_comment);
router.get('/:id/:index', checkAuthentication,commentController.delete_comment);
function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/");
    }
  };
  
module.exports = router;