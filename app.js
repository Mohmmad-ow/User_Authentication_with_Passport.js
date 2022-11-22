// Required mudoels and js files
const express = require('express')
const app = require('express')()
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const config = require('./config/passport')
const MongoStore = require('connect-mongo')
// data base connection and user table
const {connection, User} = require('./config/database')
const { json } = require('express')


app.set('views-engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({extended: true}));

require('dotenv').config()
const DB_STRING = process.env.DB_STRING
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const Store = MongoStore.create({
    mongoUrl: DB_STRING,
    mongoOptions:dbOptions
})

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: Store,
    cookie: {
        maxAge: 1000 * 24 * 60 *60
    }

}))

app.use(passport.initialize())
app.use(passport.session())





app.get('/', (req, res, next) => {
    res.render("index.ejs", {user: req.user.username})
})
app.post('/test', (req, res) => {
    console.log(req.body)
})
app.get('/login', (req, res) => {
    res.render('login.ejs')
})
app.post('/login', passport.authenticate("local"), (req, res) => {
    res.redirect("/profile")
})

function isLoggedIn(req, res, done) {
    if(req.user) {
        done()
    }
    return res.redirect("/login")
}

app.get('/profile', (req, res) => {
    if(req.user) {
        res.send(JSON.stringify(req.user))
    } else {
        return res.redirect("/login")
    }
})


app.listen(3000, () => {
    console.log(`Server runs on port 3000.`)
})