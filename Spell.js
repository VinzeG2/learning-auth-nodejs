const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster0.klxnqmt.mongodb.net/spellsproject?retryWrites=true&w=majority`)

const SpellModel = mongoose.model('Spell', {
    name: {type: String, required: true},
    type: {type: String, required: true}
})

module.exports = SpellModel