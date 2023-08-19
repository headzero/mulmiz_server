const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
	userId: { type: String, required : true },
	code : { type : String, required : true },
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
}, {
    versionKey: false 
});

const UserProfile = mongoose.model('profile', profileSchema);

module.exports = UserProfile;
