const express = require('express');
const UserProfile = require('../models/profile.js');
const shortid = require('shortid')

const router = express.Router();
const jwt = require('jsonwebtoken');
const authJwt = require('../authmiddleware');
const config = require('../config.js');


// login, 사용자 프로필이 없다면 프로필 생성
router.post('/login', async (req, res) => {

	const accessTokenInfo = req.header('Access-Token');
	if (accessTokenInfo != null) {
		try {
			const tokenInfo = await new Promise((resolve, reject) => {
				jwt.verify(accessTokenInfo, config.secret,
					(err, tokenInfo) => {
						if (err) {
							// 실패 처리 후 id로 다시 accessToken을 발급하도록 유도.
							reject(err);
						} else {
							// 검증 성공.
							resolve(tokenInfo);
						}
					});
			});
			if(tokenInfo != null) {
				UserProfile.findOne({ userId: tokenInfo.id }).exec()
                        		.then((result) => {
						res.json({ success: true, accessToken: accessTokenInfo, profile: result.profile});
					})
					.catch((err) => {
                                		res.status(403).json({ success: false, errormessage: 'Authentication fail(1)' });
                        		});
			}

		} catch (err) {
			res.status(403).json({ success: false, errormessage: 'Authentication fail(2)' });
		}
	} else {
		const id = req.body.id;

		UserProfile.findOne({ userId: id }).exec()
			.then((result) => {
				if (result == null) {
					// 최초 프로필 생성은 여기에서 이뤄진다. 
					const profile = new UserProfile({ userId: id, code : shortid.generate() });
					profile.save();
					result = profile;
				}

				new Promise((resolve, reject) => {
					jwt.sign({
						id: id,
						code : result.code
					},
						config.secret,
						{
							expiresIn: '1h'
						},
						(err, token) => {
							if (err) {
								reject(err);
							} else {
								res.json({ success: true, accessToken: token, profile : result.profile })
							}
						});
				});
			})
			.catch((err) => {
				res.status(403).json({ success: false, errormessage: 'Authentication fail(3)' });
			});
	}
}
);


router.put('/profile', authJwt, async (req, res) => {
    const profileData = req.body;
	try{
            console.log("update");
		console.log(req);
	    profileData.code = req.tokenInfo.code
            const userProfile = await UserProfile.findOneAndUpdate(
                { userId: req.id },
                { profile: profileData },
                { returnOriginal: false }
            );

		console.log(userProfile);
            res.json(userProfile);

        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, errormessage: 'Error create user profile' });
        }
});


// profile 조회
router.get('/profile', authJwt, async (req, res) => {
        console.log(req.id);

	UserProfile.findOne({ userId: req.id }).exec()
							.then((result) => {
								if (result != null) {
									// 프로필 정보 전달.
									res.json(result)
								} else {
									res.status(500).json({ success: false, errormessage: 'cannot find user(1)' });
								}
							})
							.catch((err) => {
								res.status(500).json({ success: false, errormessage: 'cannot find user(2)' });
							});
});

module.exports = router;

