const { deserializeUser } = require('passport');
const passport = require('passport')
const LocalStrategy = require("passport-local").Strategy;

const {connection, User} = require('./database')


require('dotenv').config();


passport.use(new LocalStrategy(
    {usernameField: "username", passwordField: "password"},
    (username, password, done) => {
        User.findOne({username: username}).then(theUser => {
            if (!theUser) {
                return done(null, false, {message: "User does not exist."})
            } if (!theUser.password == password) {
                return done(null, false, {message: "password is not valid."})
            }
            return done(null, true)
        })
    }
    ))

passport.serializeUser((user, done) => {
    done(null, user.id)
})
passport.deserializeUser((user, done) => {
    User.findById(user.id, (err, user) => {
        done(err, user)
    })
})
