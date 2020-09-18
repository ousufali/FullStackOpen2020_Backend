const Note = require('../models/note')
const notesRouter = require('express').Router()


notesRouter.get('/', (req, res) => {
    Note.find({}).then(result => {
        res.json(result)
    })
})

notesRouter.get('/:id', (request, response, next) => {

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
            next(error)
        })
})

notesRouter.post('/', (request, response, next) => {
    const body = request.body


    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save()
        .then(resultnote => resultnote.toJSON())
        .then(savedNote => {
            response.json(savedNote)
        })
        .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(() => response.status(204).end())
        .catch(error => next(error))

})

notesRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updateNote => {

            response.json(updateNote)
        })
        .catch(error => next(error))
})



module.exports = notesRouter