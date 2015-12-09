var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/register');
});

router.get('/register', function(req, res) {
  if(req.session.userid)
    res.redirect('answer/' + req.session.userid);
  else
    res.render('register/index');
});

router.get('/answer/:userid?', function(req, res) {
  if(req.session.userid && req.session.userid == req.params.userid )
    res.render('answer/index', { userid: req.session.userid });
  else
    res.redirect('/register');
});

router.get('/admin', function(req, res, next) {
  res.render('admin/index');
});

router.get('/result', function(req, res, next) {
  res.render('result/index');
});

router.get('/overall', function(req, res, next) {
  res.render('overall/index');
});

module.exports = router;