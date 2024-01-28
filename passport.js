const passport = require('passport');

require('dotenv').config();
const User = require('./models/user');

const GoogleStrategy = require('passport-google-oauth2').Strategy;
const facebookStrategy = require('passport-facebook').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

// used to serialize the user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const currentUser = await User.findOne({
    id
  });
  done(null, currentUser);
});

//Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/google/callback"
}, async function (accessToken, refreshToken, profile, done) {

  const id = profile.id;
  const email = profile.emails[0].value;
  const firstName = profile.name.givenName;
  const lastName = profile.name.familyName;
  const profilePhoto = profile.photos[0].value;
  const source = "google";
  const currentUser = await User.findOne({email})
  if (!currentUser) {
    const newUser = await new User({
      id,
      email,
      firstName,
      lastName,
      profilePhoto,
      source
    })
    newUser.save()

    return done(null, newUser);
  }
  if (currentUser.source != "google") {
    //return error 
    return done(null, false, {
      message: `You have previously signed up with a different signin method`
    });
  }
  currentUser.lastVisited = new Date();
  return done(null, currentUser);
}));

//facebook strategy
passport.use(new facebookStrategy({

  // pull in our app id and secret from our auth.js file
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_SECRET_ID,
  callbackURL: "http://localhost:5000/facebook/callback",
  profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email']

},// facebook will send back the token and profile
  async function (accessToken, refreshToken, profile, done) {

    const id = profile.id;
    const email = profile.emails[0].value;
    const firstName = profile.name.givenName;
    const lastName = profile.name.familyName;
    const profilePhoto = profile.photos[0].value;
    const source = "facebook";
    const currentUser = await User.findOne({ email })
    if (!currentUser) {
      const newUser = await new User({
        id,
        email,
        firstName,
        lastName,
        profilePhoto,
        source
      })
      newUser.save()

      return done(null, newUser);
    }
    if (currentUser.source != "facebook") {
      //return error 
      return done(null, false, {
        message: `You have previously signed up with a different signin method`
      });
    }
    currentUser.lastVisited = new Date();
    return done(null, currentUser);
  }));

//LinkedIn strategy
passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_SECRET_ID,
  callbackURL: "http://localhost:5000/linkedin/callback",
  scope: ['r_emailaddress', 'r_liteprofile'],
},async function (accessToken, refreshToken, profile, done) {

  const id = profile.id;
  const email = profile.emails[0].value;
  const firstName = profile.name.givenName;
  const lastName = profile.name.familyName;
  const profilePhoto = profile.photos[0].value;
  const source = "linkedin";
  const currentUser = await User.findOne({ email })
  if (!currentUser) {
    const newUser = await new User({
      id,
      email,
      firstName,
      lastName,
      profilePhoto,
      source
    })
    newUser.save()

    return done(null, newUser);
  }
  if (currentUser.source != "linkedin") {
    //return error 
    return done(null, false, {
      message: `You have previously signed up with a different signin method`
    });
  }
  currentUser.lastVisited = new Date();
  return done(null, currentUser);
}
));

//Twitter Strategy
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: "http://localhost:5000/twitter/callback",
}, async function (accessToken, refreshToken, profile, done) {

  const id = profile.id;
  const email = profile.emails[0].value;
  const firstName = profile.name.givenName;
  const lastName = profile.name.familyName;
  const profilePhoto = profile.photos[0].value;
  const source = "twitter";
  const currentUser = await User.findOne({ email })
  if (!currentUser) {
    const newUser = await new User({
      id,
      email,
      firstName,
      lastName,
      profilePhoto,
      source
    })
    newUser.save()

    return done(null, newUser);
  }
  if (currentUser.source != "twitter") {
    //return error 
    return done(null, false, {
      message: `You have previously signed up with a different signin method`
    });
  }
  currentUser.lastVisited = new Date();
  return done(null, currentUser);
}));