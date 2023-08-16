const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
	title: String,
	rating: Number,
	images: [String],
	content: String,
	link : String,
	friends : [
		{
			name : String,
			code : String,
		}
	],
	parentId : String,
	
	//server
	writer : String,
	ratingAvrage : Number,
	ratingCount : Number
});

const UserDiary = mongoose.model('diary', diarySchema);

module.exports = UserDiary;
