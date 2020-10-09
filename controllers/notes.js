const Note = require('../models/note')
const notesRouter = require('express').Router()


notesRouter.get('/', async (req, res) => {
    const notes = await Note.find({})
    res.json(notes)
    // Note.find({}).then(result => {
    //     res.json(result)
    // })
})

notesRouter.get('/:id', async (request, response) => {

    // Note.findById(request.params.id)
    //     .then(note => {
    //         if (note) {
    //             response.json(note)
    //         } else {
    //             response.status(404).end()
    //         }
    //     }
    //     )
    //     .catch(error => {
    //         next(error)
    //     })
    // try {
    const note = await Note.findById(request.params.id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }

    // } catch (exception) {
    //     next(exception)
    // }
})

notesRouter.post('/', async (request, response) => {
    const body = request.body


    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })
    // try {
    const savedNote = await note.save()
    response.json(savedNote)
    // } catch (exception) {
    //     next(exception)
    // }
    // note.save()
    //     .then(resultnote => resultnote.toJSON())
    //     .then(savedNote => {
    //         response.json(savedNote)
    //     })
    //     .catch(error => next(error))
})

notesRouter.delete('/:id', async (request, response) => {
    // Note.findByIdAndRemove(request.params.id)
    //     .then(() => response.status(204).end())
    //     .catch(error => next(error))
    // try {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
    // } catch (exception) {
    //     next(exception)
    // }
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