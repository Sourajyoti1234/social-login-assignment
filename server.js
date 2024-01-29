const express = require('express');
const passport = require('passport');
const session = require('express-session')
const bodyParser = require('body-parser')
//Setting up cookies


const mongoose = require('mongoose')
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'SECRET',
  resave: false,
  saveUninitialized: false,
  maxAge: 86400000,
  cookie: { secure: false }
}))


app.use(passport.initialize());
app.use(passport.session())

require('dotenv').config()
require('./passport')

app.set("view engine", "ejs")

app.use(express.json());




mongoose.connect('mongodb://127.0.0.1:27017/social_login_passport')
.then(()=>console.log('db connected!!'))
.catch(()=>console.log('db connection error!!'))


const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/failed', (req, res) => {
  
  res.send('Failed...')})

app.get('/good', (req, res) => {
  console.log('req==> : ',req.user.photos[0].value)

  res.render('profile', {
    name: req.user.displayName,
    pic: req.user._json.picture,
    email: req.user.emails[0].value,
    profile: "google"
  })
})

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback',
  passport.authenticate('google',
    { failureRedirect: '/failed',
      successRedirect:  '/profile',
  })
 )

const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};

app.get('/profile', isLoggedIn, (req, res) => {
  
  res.render("profile", { user: req.user });
})

app.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));

app.get('/linkedin',
  passport.authenticate('linkedin', {
    scope: ['r_emailaddress', 'r_liteprofile']
  }
  ));

app.get('/twitter',passport.authenticate('twitter'))
app.get('/twitter/callback',
  passport.authenticate('twitter',
    {
      failureRedirect: '/failed',
      successRedirect: '/profile',
    })
);

app.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }
  ));

app.get('/linkedin/callback',
  passport.authenticate('linkedin', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }
  ));



app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server is up ${PORT}`)
})

