const express  = require('express');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');


const router = express.Router();

// Storage 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// 서비스용Storage 설정
const serviceStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'service/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const serviceUpload = multer({ storage: serviceStorage });
const serviceUrl = "https://mulmiz.duckdns.org/service/";

const prefixUrl = "https://mulmiz.duckdns.org/image/";

router.post('/serviceupload', serviceUpload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.send({ filename: serviceUrl + req.file.filename });
});

router.use('/service', express.static('service', {
    setHeaders: (res, path, stat) => {
        res.set('Cache-Control', 'public, max-age=31557600');
    }
}));


router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.send({ filename: prefixUrl + req.file.filename });
});

router.use('/images', express.static('images', {
    setHeaders: (res, path, stat) => {
        res.set('Cache-Control', 'public, max-age=31557600');
    }
}));

router.get('/image/:imageName', async (req, res) => {
    const width = Number(req.query.width) || null;

    const cachedImagePath = path.join(__dirname, `images/cache/${req.params.imageName}-${width}.jpg`);

    res.set('Cache-Control', 'public, max-age=31557600');
    if (fs.existsSync(cachedImagePath)) {
        // 캐시된 이미지가 있다면 직접 제공
        return res.sendFile(cachedImagePath);
    }

    try {
        if (width) {
	    console.log('image width = ' + width);
            // 이미지 크기 조절 및 캐싱
            await sharp(`./images/${req.params.imageName}`)
                .resize(width, null)
                .toFile(cachedImagePath);

            res.sendFile(cachedImagePath);
        } else {
            // 원본 이미지 반환
            res.sendFile(path.join(__dirname, `./images/${req.params.imageName}`));
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;


