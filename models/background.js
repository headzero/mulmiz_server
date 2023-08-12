const mongoose = require('mongoose');

const backgroundSchema = new mongoose.Schema({
	bg: String,
	message: String
});

const AppBackground = mongoose.model('Background', backgroundSchema);

module.exports = AppBackground;
