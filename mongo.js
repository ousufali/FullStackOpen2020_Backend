const mongoose = require('mongoose')

console.log(process.argv.length)

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model('phonebook', phoneSchema)

if (process.argv.length < 5) {

    if (process.argv.length === 3) {
        const password = process.argv[2]
        const url = `mongodb+srv://fsdev:${password}@cluster0.n829h.mongodb.net/Phonebook-app?retryWrites=true&w=majority`
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log('Phonebook:')
        Contact.find({}).then(res => {
            res.forEach(contant => {
                console.log(contant.name, contant.number)
            })

            mongoose.connection.close()

        })




    } else {
        console.log('Please provide proper arguments, node mongo.js password name number')
        process.exit(1)
    }


}
else {
    const password = process.argv[2]
    const name = process.argv[3]
    const number = process.argv[4]
    const url = `mongodb+srv://fsdev:${password}@cluster0.n829h.mongodb.net/Phonebook-app?retryWrites=true&w=majority`

    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

    const contacts = new Contact({
        name: name,
        number: number
    })


    contacts.save().then(res => {
        console.log(`added ${res.name} number ${res.number} to phonebook`)
        mongoose.connection.close()
    })

}