const app = require('express')()
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const config = require('./config/passport')
const MongoStore = require('connect-mongo')
const {connection, User} = require('./config/database')


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
    if(req.user) {
        res.send("U R logged in " + req.user)
    } else {
        res.send("user unauthenticated")
    }
})

app.post('/login', passport.authenticate("local"), (req, res) => {
    res.json(req.user)
})

function isLoggedIn(request, response, done) {
    if(request.user) {
        done()
    }
    return response.redirect("/login")
}

app.get('/profile', isLoggedIn, (req, res) => {
    res.send(req.user)
})


app.listen(3000, () => {
    console.log(`Server runs on port 3000.`)
})