// app install and tools
const express = require('express')
const cors = require('cors')
const lowDb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const bodyParser = require('body-parser')
const { nanoid } = require('nanoid')
const { json } = require('body-parser')
const chalk = import('chalk')
const db = lowDb(new FileSync('db.json'))

// tools initialization
db.defaults({ notes: [] }).write
const app = express()
app.use(cors())
app.use(bodyParser.json())
const PORT = 8000


//function utilities
function jsonData(req) {
    let jsonObjectCreator = {
        id: req.body.id,
        quote: req.body.quote,
        author: req.body.author
    }
    return jsonObjectCreator
}

function getQuotesDataBase() {
    const wholeDataBase = db.get('notes').value()
    return wholeDataBase
}

function postAQuoteToTheDb(quoteUpload){
    let inMemoryDb = db.get('notes')
    inMemoryDb.push({
        quoteUpload, id: nanoid()
    }).write()
}

function dataBaseLength(dataBase){
    let dataBaseLength = dataBase.length
    return dataBaseLength - 1

}

function randomNumberGeneratorUpToACeiling(Math,ceiling){
    let randomNumber = Math.floor(Math.random() * ceiling)
    return randomNumber
}

function getQuoteByIDFromDataBase(idProvided) {
    let memoryStorageDb = getQuotesDataBase()
    let memoryStorageQuotesIds = memoryStorageDb.find(quote => quote.id == `${idProvided}`)
    return memoryStorageQuotesIds
}

function getQuoteByQuoteFromDataBase(quoteProvided) {
    let memoryStorageDb = getQuotesDataBase()
    let memoryStorageQuotesIds = memoryStorageDb.find(Element => Element.quoteUpload.quote === quoteProvided)
    return memoryStorageQuotesIds
}

function idIdentifier(id, response, goodStatus, badStatus) {
    if (id !== undefined) {
        return response.sendStatus(goodStatus)
    }
    return response.sendStatus(badStatus)
}



//get all quotes
app.get('/allquotes', (req, res) => {
    const onMemoryDatabase = getQuotesDataBase()
    res.status(200).json(onMemoryDatabase)
})

//get random quote
app.get('/quote', (req, res) => {
    //onMemoryData base to be browsed
    const onMemoryDatabase = getQuotesDataBase()

    //onMemory length of the whole database to be used as a parameter
    // for the random number generator
    let lengthOfDataBase = dataBaseLength(onMemoryDatabase)

    // random number generator with a ceiling of the length of the DB
    let randomNumber = randomNumberGeneratorUpToACeiling(Math,lengthOfDataBase)
    // response status and a json body made from a random quote generated
    // by the random number previosly generated on memory
    res.status(200).json(onMemoryDatabase[randomNumber])
})


//POST REQUEST WITH SAME QUOTE CONTENT FILTER
app.post('/home/newquote', (req, res) => {
    // json object requested formated in id, author and quote
    let jsonDataRequested = jsonData(req)
    
    // filters the DB with the quote of the Requested body
    const taskFound = getQuoteByQuoteFromDataBase(jsonDataRequested.quote)

    //if it finds a match, it sends a 409
    if (taskFound) {
        return res.sendStatus(409)
    }// if it doesnt it post a new quote with the body provided by the request and a unique ID
    else {
        postAQuoteToTheDb(jsonDataRequested)
        return res.sendStatus(200)
    }
})




//PUT REQUEST TO UPDATE DB ITEMS BASED ON ID
app.put('/updateQoute', (req, res) => {
    // In memory Json object request containing the Quote, Author and ID
    let memoryStorageJsonData = jsonData(req)

    // In memory Quote from the DB filtere by using the json request id
    let quoteToBeModifiedFilteredById = getQuoteByIDFromDataBase(memoryStorageJsonData.id)

    // idIdentifier verifies if the Id sent in the request is related to one of our quotes,
    // if it isnt it sends back a 404 status code, if it is it sends a 204 no content
    idIdentifier(quoteToBeModifiedFilteredById, res, 204, 404)
})



// 5.- DELETE /quote/:id that will only accept the id as path variable
app.delete('/quote/:id', (req, res) => {
    let idProvided = req.params.id
    let quoteToBeDeletedByID = getQuoteByIDFromDataBase(idProvided)
    // a.- On success will return http status code 200
    // b.- On quote not found will return http status code 404
    idIdentifier(quoteToBeDeletedByID, res, 200, 404)
})



app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`)
})

