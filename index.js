const express = require('express')
const morgan = require('morgan')
const { json } = require('express')
const cors = require('cors')


const app = express()
app.use(cors())

app.use(express.json())
app.use(express.static('build'))

morgan.token("sendData",req => JSON.stringify(req.body))
app.use(morgan(":method :url :status :res[content-length] :response-time --  :sendData"))


let persons = [
    {
        name: "Yousuf ali",
        number: "0348-3176127",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "ama",
        number: "12-43-234345",
        id: 3
    }
    

]
const unknownEndPoint = (req, res) => {
    res.status(404).send({ error: "Unknown endpoint" })
}

const generateId = () => {

    return Math.floor(Math.random() * 1000)
}

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})
app.get('/api/persons/:id', (req, res) => {
    // console.log(req.params.id)
    let contact = persons.find((x) => x.id === Number(req.params.id))

    // console.log(contact)
    if (!contact) {
        res.status(404).end()
    } else {
        res.json(contact)
    }




})

app.get('/info', (req, res) => {
    const count = persons.length
    console.log(count)
    // let description = `Phonebook has info for ${count} people`
    // let date = Date()
    // result = [description,date].join("\n")

    let result = `Phonebook has info for ${count} people \n\n${Date()}`

    // res.json(result)
    res.send(result)

})

app.delete('/api/persons/:id', (req, res) => {
    console.log(persons, '\n ')

    const id = Number(req.params.id)
    const contact = persons.find((x) => x.id === id)
    if (!contact) {
        res.status(404).end('Id not exist')
    }
    else {
        persons = persons.filter((x) => x.id !== id)

        console.log(persons)

        res.status(204).end()
    }

})

app.post('/api/persons', (req, res) => {

    if (!req.body.name || !req.body.number) {
        res.status(404).json("Name or number is missing")
    }

    const find_name = persons.find((x) => x.name === req.body.name)
    // console.log("Post_already have person: ", find_name)
    if (find_name) {
        res.status(422).json("Use unique name")

    } else {
        const contact = {
            name: req.body.name,
            number: req.body.number || '0000-000',
            id: generateId()
        }
        console.log(contact.id)
        persons = persons.concat(contact)
        res.json(contact)
    }


})

app.use(unknownEndPoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))