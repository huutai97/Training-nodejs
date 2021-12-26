var express = require('express');
var router = express.Router();
var passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const systemConfig = require('../../configs/system');
const ValidateLogin = require('../../validator/login');
const folderView = 'pages/auth/';
const linkIndex = '/' + systemConfig.admin + '/auth/';
const loginFail = 'erp/auth/login';
const userLogin = require('./../../schemas/users');
const usersModel = require('./../../models/users'); // patch models

 /* GET logout. */ 
 router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/');
});
/* GET login erp. */ 
router.get('/login', function (req, res, next) {
    let itemLogin = {userName:'',passWord:''};
    let errors = null;
    res.render(`${folderView}login`,{itemLogin,errors}); 
});

router.post('/login', function (req, res, next) {
    req.body = JSON.parse(JSON.stringify(req.body));
    ValidateLogin.validator(req);
    let itemLogin = Object.assign(req.body);
    let errors = req.validationErrors();
    console.log(errors)
    if(errors){
        res.render(`${folderView}login`,{itemLogin,errors});
    }else{ 
      console.log('local')
      passport.authenticate('local', {
      successRedirect: '/1',
      failureRedirect: '/2' ,
      })(req, res, next);
     
    }
    // console.log(itemLogin.userName+"-"+itemLogin.passWord)
    
});


passport.use(new LocalStrategy(
  function(userName, passWord, done) {
    console.log(userName +"-" + passWord+"ok")
    // userLogin.findOne({ userName: userName }, function (err, user) {
    
    // });
    return done;
  }
));


module.exports = router;
