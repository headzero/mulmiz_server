const express = require('express');
const UserProfile = require('../models/profile.js');

const router = express.Router();

router.post('/profile', async (req, res) => {
	const { name, message } = req.body;

	try {
		const profile = new UserProfile({bg, message});
		await background.save();
		res.send(background);
	} catch(err) {
		console.log(err);
		res.status(500).send(err);
	}
});


router.get('/appbgs', async (req, res) => {
  try {
    const backgrounds = await AppBackground.find({});
    res.send(backgrounds);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.delete('/appbg/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const background = await AppBackground.findByIdAndDelete(id);
    res.send(background);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
