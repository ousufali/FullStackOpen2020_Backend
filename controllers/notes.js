const Note = require('../models/note')
const User = require('../models/user')
const notesRouter = require('express').Router()


notesRouter.get('/', async (req, res) => {
    const notes = await Note.find({}).populate('user', { username: true, name: true })
    res.json(notes)

})

notesRouter.get('/:id', async (request, response) => {


    const note = await Note.findById(request.params.id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }

})

notesRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findById(body.userId)
    console.log('printing user data ..............')
    console.log(user.username)
    console.log(' ..............')

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
        user: user.id
    })
    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote.id)
    await user.save()

    response.json(savedNote)

})

notesRouter.delete('/:id', async (request, response) => {

    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()

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