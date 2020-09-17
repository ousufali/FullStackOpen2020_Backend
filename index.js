require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/phonebook')


const app = express()
app.use(cors())

app.use(express.json())
app.use(express.static('build'))

morgan.token('sendData',req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] :response-time --  :sendData'))

const errorHandler = (error,req,res,next) => {
    if(error.name === 'CastError')
    {
        return res.status(400).send({ error:'malformed id' })
    }else if(error.name === 'ValidationError')
    {
        console.log(error.name,'   message',error.message,'\n\nenddddddddddddddddd' )
        res.status(400).end()//json({ error: error.message })
    }
}

app.use(errorHandler)

// let persons = [
//     {
//         name: 'Yousuf ali',
//         number: '0348-3176127',
//         id: 1
//     },
//     {
//         name: 'Ada Lovelace',
//         number: '39-44-5323523',
//         id: 2
//     },
//     {
//         name: 'ama',
//         number: '12-43-234345',
//         id: 3
//     }


// ]

const unknownEndPoint = (req, res) => {
    res.status(404).send({ error: 'Unknown endpoint' })
}

// const generateId = () => {

//     return Math.floor(Math.random() * 1000)
// }

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.get('/api/persons', (req, res) => {
    // res.json(persons)
    Contact.find({})
        .then(result => {
            console.log(result)
            res.json(result)
        })
})
app.get('/api/persons/:id', (req, res,next) => {
    // // console.log(req.params.id)
    // let contact = persons.find((x) => x.id === Number(req.params.id))

    // // console.log(contact)
    // if (!contact) {
    //     res.status(404).end()
    // } else {
    //     res.json(contact)
    // }

    Contact.findById(req.params.id)
        .then(result => res.json(result))
        .catch(error => next(error))


})

app.get('/info', (req, res) => {
    // const count = persons.length
    const count = Contact.count()
    console.log(count)
    // let description = `Phonebook has info for ${count} people`
    // let date = Date()
    // result = [description,date].join("\n")

    let result = `Phonebook has info for ${count} people \n\n${Date()}`

    // res.json(result)
    res.send(result)

})

app.delete('/api/persons/:id', (req, res,next) => {
    // const id = Number(req.params.id)
    // const contact = persons.find((x) => x.id === id)
    // if (!contact) {
    //     res.status(404).end('Id not exist')
    // }
    // else {
    //     persons = persons.filter((x) => x.id !== id)

    //     console.log(persons)

    //     res.status(204).end()
    // }

    Contact.findByIdAndDelete(req.params.id)
        .then(result => res.status(204).end())
        .catch(error => next(error))

})

app.post('/api/persons', (req, res,next) => {

    console.log('..................posting new contact....................')
    const body = req.body
    // if(!body.name || !body.number)
    // {
    //     res.status(400).json({ error: 'name or number missing' })
    // }


    const contact = new Contact ({
        name: body.name,
        number: body.number,
    })

    contact.save()
        .then(resultdata => resultdata.toJSON())
        .then(savedcontact => res.json(savedcontact))
        .catch(error => next(error))

})

app.put('/api/persons/:id', (req,res,next) => {
    console.log('..................put update....................')
    const contact = {
        name: req.body.name,
        number: req.body.number,
    }
    console.log('contact :',contact)

    Contact.findByIdAndUpdate(req.params.id,contact,{ new:true })
        .then(updatenumber => res.json(updatenumber))
        .catch(error => next(error))
})

app.use(unknownEndPoint)
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))