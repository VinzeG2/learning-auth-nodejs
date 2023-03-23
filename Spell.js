require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.klxnqmt.mongodb.net/spellsproject?retryWrites=true&w=majority`)

const SpellModel = mongoose.model('Spell', {
    name: {type: String, required: true},
    type: {type: String, required: true}
})

module.exports = SpellModel