const jwt = require('jsonwebtoken');
const config = require('./config.js');

const authMiddleware = async (req, res, next) => {
	const accessToken = req.header('Access-Token');
	if (accessToken == null) {
		res.status(403).json({success:false, errormessage:'Authentication empty fail'});
	} else {
		try {
			const tokenInfo = await new Promise((resolve, reject) => {
				jwt.verify(accessToken, config.secret,
					(err, decoded) => {
						if (err) {
							reject(err);
						} else {
							console.log("authmiddleware");
							console.log(decoded);
							req.id = decoded.id;
							req.code = decoded.code;
							resolve(decoded);
						}
					});
			});
			req.tokenInfo = tokenInfo;
			next();
		} catch(err) {
			console.log(err);
			res.status(403).json({success:false, errormessage:'Authentication fail'});
		}
	}
}

module.exports = authMiddleware;

