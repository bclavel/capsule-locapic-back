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

    userModel.findOne({facebookId : req.user.id})
    .exec(function(err, user) {
      if (!user) {
        var newUser = new userModel({
          firstName : req.user.first_name,
          lastName : req.user.last_name,
          email : req.user.email,
          facebookId : req.user.id
        })
        newUser.save(
          function (error, user) {
            console.log('INDEX BACK - New user save', user);
          }
        )
      } else {
        console.log('user existe déjà, pas de création');
      }
    })

    res.redirect(req.user.redirectUrl
      +"?userId="+req.user.id
      +"&firstName="+req.user.first_name
      +"&lastName="+req.user.last_name
      +"&email="+req.user.email);
  }
);


router.post('/logPosition',
  function(req,res,next) {
    userModel.findOne({facebookId : req.body.facebookId})
    .exec(function (err, user) {
      console.log('INDEX BACK - FindOne user', user);
      user.historiquePosition.push(
        {
          latitude: req.body.userLat,
          longitude: req.body.userLon,
        }
      )

      user.save(
        function(error, user) {
          console.log('INDEX BACK - Save user', user);
          res.json({ user });
        }
      )
    })
  }
)

module.exports = router;
