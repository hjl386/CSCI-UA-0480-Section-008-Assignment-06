// Database 

const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const User = new mongoose.Schema({
	username: {type: String, unique: true},
	password: String
});

//User.plugin(URLSlugs('title'));

mongoose.model('User', User);
mongoose.connect('mongodb://localhost/hw06');
