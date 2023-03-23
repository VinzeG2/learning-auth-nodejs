require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.klxnqmt.mongodb.net/spellsproject?retryWrites=true&w=majority`)

const UserModel = mongoose.model('User', {
    username: {type: String, required: true},
    password: {type: String, required: true},
    salt: {type: String, required: true}
})

module.exports = UserModel