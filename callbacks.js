// A module of the callback functions 

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const mongoose = require('mongoose');
const User = mongoose.model('User'); 

bcrypt.hash(myPlaintextPassword, saltRounds, (err, hash) => {
	User.findOneAndUpdate({}, {$push: {username: req.body.username, password: req.body.password}}, (err) => {
		if(err){
			console.log(err);
		}
		
	});	
});
