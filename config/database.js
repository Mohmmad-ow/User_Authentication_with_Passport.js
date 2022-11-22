const mongoose = require('mongoose')
require('dotenv').config();






const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const DB_STRING = process.env.DB_STRING

const connection = mongoose.connect(DB_STRING, dbOptions)

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
})

const User = mongoose.model("User", UserSchema)



module.exports = {connection, User}
