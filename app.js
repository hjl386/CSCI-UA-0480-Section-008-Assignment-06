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
	secret: 'peaow8rk2n0-h.;u/abue.j9c1ko[-m]',
	resave: true, 
	saveUninitialized: true
};
app.use(session(sessionOptions));

app.get('/css/base.css', (req, res) => {
	res.render('base.css');
});

app.get('/', (req, res) => {
	let sess = true;
	if(req.session.username === undefined){  // or if(req.session.username){}
		sess = false;
	} 
	res.render('home', {sess: sess, username: req.session.username});
});

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', (req, res) => {
	const u = new User({
		username: req.body.username,
		password: req.body.password
	});
	if(u.password.length < 8){
		res.render('register', {passwordLength: true});
	} else{
		User.findOne({username: req.body.username}, (err, user) => {
			if(err) {
				console.log(err);
			} else if(user){
				res.render('register', {userExists: true});
			} else{
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
								res.send('An error has occured, see the server logs for more information');
							}
						});		
					});
				});
			}
		});
	}
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.post('/login', (req, res) => {
	User.findOne({username: req.body.username}, (err, user) => {
		if(err){
			console.log(err);
			res.send('An error has occured, see the server logs for more information');
		} else if(!err && user){
			bcrypt.compare(req.body.password, user.password, (err, passwordMatch) => {
				if(passwordMatch){
					req.session.regenerate(err => {
						if(!err){
							req.session.username = user.username;
							res.redirect('/');
						} else {
							console.log(err);
							res.send('An error has occured, see the server logs for more information');	
						}		
					});
				} else {
					res.render('login', {fail: true});
				}
			});			
		} else{
			res.render('login', {userNotExists: true});
		}
	});
});

app.get('/restricted', (req, res) => {
	if(req.session.username === undefined){
		res.redirect('/login');
	} else{
		res.render('restricted');
	}
});

app.get('/logout', (req, res) => {
	req.session.destroy(err => {
		if(err){
			console.log(err);
		} else{
			res.redirect('/');
		}
	});	
});

app.listen(PORT, HOST);
