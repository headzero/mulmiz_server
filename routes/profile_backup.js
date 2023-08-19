const express = require('express');
const UserProfile = require('../models/profile.js');

const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config.js');

router.post('/login', async (req, res) => {

	const accessToken = req.header('Access-Token');
	if (accessToken != null) {
		try {
			const tokenInfo = new Promise((resolve, reject) => {
				jwt.verify(accessToken, config.secret,
					(err, tokenInfo) => {
						if (err) {
							console.log(err);
							reject(err);
						} else {
							console.log("accessToken from header");
                        				console.log(tokenInfo);

							UserProfile.findOne({userId : tokenInfo.id}).exec()
                                .then((result) => {
                                        console.log("/login - token result");
                                        console.log(result);

                                 if(result != null) {
                                                // 프로필 정보 전달.
                                         res.json({success:true, accessToken : tokenInfo, result : result})
                                } else {
                                         const profile = new UserProfile({userId : tokenInfo.id});
                                        profile.save();
                                        res.send(profile);

                                        console.log(profile);
                                }
                                })
                                .catch((err) => {
                                        console.log("/login -> err");
                                        console.log(err);
                                        res.status(403).json({success:false, errormessage:'Authentication fail(1)'});
                        });

							//resolve(decoded);
						}
					});
			});

		} catch(err) {
			console.log(err);
			res.status(403).json({success:false, errormessage:'Authentication fail(2)'});
		}
	} else {
		const id = req.body.id;

		UserProfile.findOne({userId : id}).exec()
		.then((result) => {
			console.log("/login - result");

			if(result == null) {
				const profile = new UserProfile({userId : id});
				profile.save();
				result = profile;
				res.send(profile);
			}

			new Promise((resolve, reject) => {
				jwt.sign({
					id : id
				},
				config.secret,
				{
					expiresIn : '30d'
				},
				(err, token) => {
					if (err) {
						console.log(err);
						reject(err);
					} else {
						console.log(token);
                        			res.json({success:true, accessToken : token, result : result})
					}
				});
			});


		})
		.catch((err) => {
			console.log("/login -> err");
			console.log(err);
			res.status(403).json({success:false, errormessage:'Authentication fail(3)'});
		});
	}
}
);

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
