require('dotenv').config()
const express = require('express')
const spell = require('./spells.controller')
const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.klxnqmt.mongodb.net/spellsproject?retryWrites=true&w=majority`)
const app = express();
app.use(express.json())

app.get('/spells', spell.listAll)
app.get('/spells/:id', spell.get)
app.post('/spells', spell.create)
app.delete('/spells/:id', spell.delete)

app.use(express.static('app'))

app.get('/', (req, res) => {
    console.log(__dirname);
    res.sendFile(`${__dirname}/index.html`);
})

app.listen('3000', () => {
    console.log("Listening on port 3000...");
})