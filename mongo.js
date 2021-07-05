let mongoose = require('mongoose')
let mongoPath = 'mongodb+srv://user1:user@example.7j3yd.mongodb.net/Restaurants?retryWrites=true&w=majority'

module.exports = async () => {
	await mongoose.connect(mongoPath, {useNewUrlParser: true, useUnifiedTopology: true})
	return mongoose
}