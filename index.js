const express = require('express')
const cors = require('cors')
const lowDb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const bodyParser = require('body-parser')
const { nanoid } = require('nanoid')
const { json } = require('body-parser')
const chalk = import('chalk')

const db = lowDb(new FileSync('db.json'))

db.defaults({ notes: [] }).write

const app = express()

app.use(cors())
app.use(bodyParser.json())

const PORT = 8000


//get all quotes
app.get('/allquotes', (req, res) => {
    const wholeDataBase = db.get('notes').value()
    const pushtest = []
    
    pushtest.push(wholeDataBase)
    console.log(pushtest[0])
    let randomizer = Math.floor(Math.random() * 4)
    res.status(200).json(pushtest)
})

//get random quote
app.get('/quote', (req, res) => {
    const wholeDataBase = db.get('notes').value()
    const pushtest = []
    pushtest.push(wholeDataBase)
    let randomizer = Math.floor(Math.random() * 4)
    console.log(pushtest[0])
    res.status(200).json(pushtest[0][randomizer])
})




//POST REQUEST WITH SAME QUOTE CONTENT FILTER
app.post('/home/newquote', (req, res) => {
    const quoteUpload = {
        quote: req.body.quote,
        author: req.body.author
    }
    const wholeDataBase = db.get('notes').value()
    const pushtest = []
    pushtest.push(wholeDataBase)
    const taskFound = wholeDataBase.find(Element => Element.quoteUpload.quote === quoteUpload.quote)
    if (taskFound) {
        return res.sendStatus(409)
    }
    else {
        db.get('notes').push({
            quoteUpload, id: nanoid()
        }).write()
        return res.sendStatus(200)
    }
})



app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`)
})