// app.js

// A taste of login! - express app demonstrating registration and login

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('./db');

const [PORT, HOST] = [3000, '127.0.0.1'];
const app = express();
const User = mongoose.model('User');
const saltRounds = 10;	// Might move to app.post for register

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const sessionOptions = {
	secret: 'secret thing',
	resave: true, 
	saveUninitialized: true
}
app.use(session(sessionOptions));

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

function regenerateSession(err, req, res){
	if(!err){
		req.session.username = uHashed.username;
		res.redirect('/');
	} else{
		console.log(err)
		res.send("ERROR");
	}	
}

function hashP(err, req, res, hash){
	if(err){
		console.log(err);
	}
	const uHashed = new User({
		username: req.body.username,
		password: hash
	});
	uHashed.save(err =>{
		if(err){
			console.log(err);
		}
		req.session.regenerate(regenerateSession);
	});
}

app.post('/register', (req, res) => {
	const u = new User({
		username: req.body.username,
		password: req.body.password
	});
	User.findOne({username: req.body.username}, (err, user) => {
		if(user){
			console.log("DOES IT RE RENDER THE REGISTRATION PAGE?");
			res.render('register', {userExists: true});
		}
	});
	if(u.password.length < 8){
		res.render('register', {passwordLength: true});
	} else{
		bcrypt.hash(u.password, saltRounds, hashP()); 
	}
/*	} else{
		bcrypt.hash(u.password, saltRounds, (err, hash) => { 
			if(err){
				console.log(err);
			}
			const uHashed = new User({
				username: req.body.username,
				password: hash
			});
			uHashed.save(err => {
				if(err){
					console.log(err);
				}
				req.session.regenerate(err => {
					if(!err){
						req.session.username = uHashed.username;
						res.redirect('/');
					} else {
						console.log(err);
						res.send('An error has occured, please see the server logs for more information');
					}
				});		
			});
		});
	}
*/
});

app.listen(PORT, HOST);
