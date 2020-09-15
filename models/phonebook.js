const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology: true})
.then((result)=>console.log('connected to mongodb'))
.catch(error=>console.log('Error connecting to mongodb',error.message))

const phonebookSchema = new mongoose.Schema({
    name:String,
    number:String,
})

phonebookSchema.set('toJSON',{
    transform: (document,returnedObject)=> {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('phonebook',phonebookSchema)