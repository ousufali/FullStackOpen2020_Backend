const bcrypt = require('bcrypt')
const { request } = require('express')
const userRouter = require('express').Router()
const User = require('../models/user')


userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('notes', { content: true, date: true })
    response.json(users)
})

userRouter.post('/', async (request, response) => {
    const body = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const savedUser = await user.save()
    response.json(savedUser)


})

module.exports = userRouter