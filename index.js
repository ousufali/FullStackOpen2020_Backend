require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Note = require('./models/note')


const app = express()

app.use(cors())
app.use(express.static('build'))
morgan.token('mylooger', req => JSON.stringify(req.body))

app.use(morgan(':method :url :status :response-time :mylooger'))
app.use(express.json())

const wrongurl = (req, res) => {
    return res.status(404).send('Unknown address')
}

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformed id' })
    }else if(error.name === 'ValidationError'){
        return res.status(400).json({ error: error.message })

    }
    next(error)
}

app.use(errorHandler)

// let notes = [
//   {
//     id: 1,
//     content: 'HTML is easy',
//     date: '2020-01-10T17:30:31.098Z',
//     important: true
//   },
//   {
//     id: 2,
//     content: 'Browser can execute only Javascript',
//     date: '2020-01-10T18:39:34.091Z',
//     important: false
//   },
//   {
//     id: 3,
//     content: 'GET and POST are the most important methods of HTTP protocol',
//     date: '2020-01-10T19:20:14.298Z',
//     important: true
//   }
// ]

app.get('/', (req, res) => {
    //res.send('<h1>Hello Yousuf!     base address render</h1>')
    res.sendFile('index.html')

})

app.get('/api/notes', (req, res) => {
    // res.json(notes)
    Note.find({}).then(result => {
        res.json(result)
    })
})

// const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
// }

app.post('/api/notes', (request, response,next) => {
    const body = request.body

    // if (!body.content) {
    //   return response.status(400).json({
    //     error: 'content missing'
    //   })
    // }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    // id: generateId(),
    })

    // notes = notes.concat(note)

    // response.json(note)
    note.save()
        .then(resultnote => resultnote.toJSON())
        .then(savedNote => {
            // console.log('savednote::::',savedNote)
            response.json(savedNote)
        })
        .catch(error => next(error))
})

app.get('/api/notes/:id', (request, response, next) => {

    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        }
        )
        .catch(error => {
            // console.log(',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,')
            // console.log(error)
            // console.log('..........................................')

            // response.status(400).send({error:'malformated id'})
            next(error)
        })

    // const id = Number(request.params.id)
    // const note = notes.find(note => note.id === id)
    // if (note) {
    //   response.json(note)
    // } else {
    //   response.status(404).end()
    // }
})

app.delete('/api/notes/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // notes = notes.filter(note => note.id !== id)

    // response.status(204).end()
    Note.findByIdAndRemove(request.params.id)
        .then(result => response.status(204).end())
        .catch(error => next(error))

})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updateNote => {
            console.log(updateNote)

            response.json(updateNote)
        })
        .catch(error => next(error))
})

app.use(wrongurl)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
