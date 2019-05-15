var express = require('express');
var router = express.Router();
var passport = require('passport');
var userModel = require('../models/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Coucou Express' });
});

router.get('/auth/facebook',
  function(req,res,next) {
      passport.authenticate(
          'facebook', { scope : 'email', state: JSON.stringify(req.query) }
      )(req,res,next);
  }
)

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { session: false }),

  function(req, res) {

    var newUser = new userModel({
      firstName : req.user.first_name,
      lastName : req.user.last_name,
      email : req.user.email,
      facebookId : req.user.id
    })

    newUser.save(
      function (error, user) {
        console.log(user);
      }
    )

    res.redirect(req.user.redirectUrl
      +"?userId="+req.user.id
      +"&firstName="+req.user.first_name
      +"&lastName="+req.user.last_name
      +"&email="+req.user.email);
  }
);


router.post('/logPosition',
  function(req,res,next) {
    userModel.findOne({facebookid : req.body.facebookId})
    .exec(function (err, data) {
      console.log('INDEX BACK - FindOne Data', data);
    })
  }
)

module.exports = router;
