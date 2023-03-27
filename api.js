require('dotenv').config()
const express = require('express')
const spell = require('./spells.controller')
const mongoose = require('mongoose')
const { Auth, isAuthenticated } = require('./auth.controller')

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.klxnqmt.mongodb.net/spellsproject?retryWrites=true&w=majority`)
const app = express();
app.use(express.json())

app.get('/spells', isAuthenticated, spell.listAll)
app.get('/spells/:id', isAuthenticated, spell.get)
app.post('/spells', isAuthenticated, spell.create)
app.delete('/spells/:id', isAuthenticated, spell.delete)

app.post('/login', Auth.login)
app.post('/register', Auth.register)

app.use(express.static('app'))

app.get('/', (req, res) => {
    console.log(__dirname);
    res.sendFile(`${__dirname}/index.html`);
})

app.listen('3000', () => {
    console.log("Listening on port 3000...");
})