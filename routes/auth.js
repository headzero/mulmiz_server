const express = require('express');
const router = express.Router();
const config = require('./config.js');

const KakaoStrategy = require('passport-kakao').Strategy;
const jwt = require('jsonwebtoken');

passport.use(new KakaoStrategy({
    clientID: config.kakao_rest_api,
    callbackURL: 'http://mulmiz.duckdns.org/auth/kakao/callback',
}, function(accessToken, refreshToken, profile, done) {
    // 사용자의 정보를 이용해 DB에서 사용자를 찾거나 새로운 사용자를 생성합니다.
    // 이후 JWT 토큰을 생성해 반환할 수 있습니다.
    const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile._json.kaccount_email,
        // 기타 필요한 정보를 추가합니다.
    };
    console.log(user);
    return done(null, user);
}));



router.get('/auth/kakao', passport.authenticate('kakao'));

router.get('/auth/kakao/callback', 
    passport.authenticate('kakao', { failureRedirect: '/login' }),
    function(req, res) {
        const token = jwt.sign(req.user, config.secret);
        res.redirect(`/success?token=${token}`);
    }
);

module.exports = router;
