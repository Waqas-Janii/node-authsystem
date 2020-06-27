var express = require('express');
var router = express.Router();
var Post = require('../models/post');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toDateString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
// Get Register
router.get('/', checkAuthenticated, paginatedResults(Post), function (req, res) {
    res.json(res.paginatedResults)
});


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')

}
function paginatedResults(model) {
    return async (req, res, next) => {
        let page = 1;
        let limit = 4;
        if (Object.keys(req.query).length !== 0) {
            if (req.query.page !== undefined) {
                page = parseInt(req.query.page)
            }
            if (req.query.limit !== undefined) {
                limit = parseInt(req.query.limit)
            }
        }
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const results = {}
        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}
router.post("/upload", upload.single('postImg'), (req, res, next) => {
    console.log('file', req.file)
    const post = new Post({
        name: req.body.name,
        content: req.body.content,
        postImg: req.file.path
    });
    post
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created product successfully",
                createdProduct: {
                    name: result.name,
                    price: result.content,
                    request: {
                        type: 'GET',
                        url: "http://localhost:5000/post/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
module.exports = router;