const express = require('express')
const cors = require('cors')
const lowDb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const bodyParser = require('body-parser')
const { nanoid } = require('nanoid')
const chalk = import('chalk')

const db = lowDb(new FileSync('db.json'))

db.defaults({notes:[]}).write

const app = express()

app.use(cors())
app.use(bodyParser.json())

const PORT = 8000

app.get('/home', (req,res) =>{
    const wholeDataBase = db.get('notes').value()
    const pushtest = []
    pushtest.push(wholeDataBase)
    let randomizer = Math.floor(Math.random() * 4)
    res.json(pushtest[0][randomizer])
})

//get random quote
app.get('/quote', (req,res) =>{
    const wholeDataBase = db.get('notes').value()
    const pushtest = []
    pushtest.push(wholeDataBase)
    let randomizer = Math.floor(Math.random() * 4)
    res.json(pushtest[0][randomizer])
})





app.post('/home/newquote', (req,res) =>{
    const note = req.body
    db.get('notes').push({
        ...note, id: nanoid()
    }).write()
    res.json({ success:true })
})

app.listen(PORT, ()=>{
    console.log(`Backend is running on port ${PORT}`)
})