// app.js

// A taste of login! - express app demonstrating registration and login

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
require('./db');

const [PORT, HOST] = [3000, '127.0.0.1'];
const app = express();
const User = mongoose.model('User');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
//app.use(session(sessionOptions));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/*
const sessionOptions = {
	secret: 'secret thing',
	resave: true, 
	saveUninitialized: true
}
*/

app.get('/css/base.css', (req, res) => {
	res.render('base.css');
});

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/register', (req, res) => {
	User.find({}, (err, users) => {
		if(err){
			console.log(err);
		}
		res.render('register', {users: users});
	});
});

app.post('/register', (req, res) => {
	User.findOneAndUpdate({$push: {username: req.body.username, password: req.body.password}}, (err) => {
		if (err) {
			console.log(err);
		}
		if (req.body.password < 8){
			
		}
	});
});

app.listen(PORT, HOST);
