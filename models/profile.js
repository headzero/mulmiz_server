const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
	userId: String,
	profile: {
		name : String,
		code : String,
		message : String,
		imageUrl : String,
	},
	friends : [
		{
			name : String,
			code : String,
			message : String,
			imageUrl : String
		}
	]
});

const UserProfile = mongoose.model('profile', profileSchema);

module.exports = UserProfile;
