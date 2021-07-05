const express = require('express')
const app = express()
const jsonParser = express.json()
const cors = require('cors')
const passwordHash = require('password-hash');
const mongoose = require("mongoose")
const Schema = mongoose.Schema

let PORT = process.env.PORT || 80

let mongo = require('./mongo')
let connectToMongoDb = async () => {
	await mongo().then(MongoClient => {
		try{
			console.log('Connected to mongoDB!')
		} finally{
			console.log("ok")
		}
	})
}
connectToMongoDb()

function hash(text){
	return text.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
}

const server = require('http').createServer(app).listen(PORT)

app.use(cors())
  
const userScheme = new Schema({
    login: String,
    password: Number,
    notes: Array
});
  
const User = mongoose.model("User", userScheme);

app.get('/', (req, res)=>{
	res.send('Hello!')
})

app.get('/signup', jsonParser, (req, res)=>{
	let data = req.query
	User.findOne({login: data.login}, (err, docs)=>{
		if(docs == undefined){
			if(data.login.length < 4 || data.login.length > 20){
		        res.status(404).send('The login must contain from 4 to 20 letters')
	        }
	        else if(data.password1 != data.password2){
		        res.status(404).send("Passwords don't match")
	        }
	        else if(data.password1.length < 4 || data.password1.length > 20){
		        res.status(404).send('The password must contain from 4 to 20 letters')
	        }
	        else{
		        let user = {login: data.login, password: hash(data.password1), notes: []}
		        User.create(user, ()=>{
		        	res.status(200).send(user)
		        })
	        }
		}
		else{
			res.status(404).send("The login is occupied")
		}
	})
})

app.get('/signin', jsonParser, (req, res)=>{
	let data = req.query
	User.findOne({login: data.login}, (err, docs)=>{
		if(docs != undefined){
			console.log(docs.password)
			console.log(hash(data.password))
			if(docs.password == hash(data.password)){
				res.status(200).send(docs)
			}
			else{
				res.status(404).send('The password is wrong')
			}
		}
		else{
			res.status(404).send("There are not users with this login")
		}
	})
})

app.get('/getUserNotes', jsonParser, (req, res)=>{
	let data = req.query
	console.log(data)
	User.findOne({login: data.login}, (err, docs)=>{
		if(docs != undefined){
			if(docs.password == data.password){
				res.status(200).send(docs.notes)
			}
			else{
				res.status(499).send('The password is wrong')
			}
		}
		else{
			res.status(499).send('There are not users with this login')
		}
	})
})