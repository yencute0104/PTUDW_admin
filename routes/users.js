const app = require('../app');
const express = require('express');
const router = express.Router();
const passport = require('../passport');

const userController = require('../controllers/userController');
const adminModel = require('../models/adminModel');
const indexRouter = require('../routes/index');

router.get('/', isNotLogined, function(req, res, next){
  const message = req.flash('error');
  res.render('login',{title: 'Đăng nhập', message, hasErr: message.length > 0});
});

router.post('/', passport.authenticate('local', { 
  successRedirect: '/home',
  failureRedirect: '/',
  failureFlash: true}));

router.get('/logout', checkAuthentication, function(req, res, next){
  req.logout();
  const message = req.flash('error');
  res.redirect('/');
});

function checkAuthentication(req,res,next){
  if(req.isAuthenticated()){
      //req.isAuthenticated() will return true if user is logged in
      next();
  } else{
      res.redirect("/");
  }
};

function isNotLogined(req,res,next){
  if(req.isAuthenticated()){
      res.redirect('/home');
      
  } else{
    next();
  }
};
module.exports = router;
