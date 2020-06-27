var express = require('express');
var router = express.Router();
// Get Register
router.get('/', checkAuthenticated, function (req, res) {
    // res.render('../public/home.html')
    res.send('Welcome to home')
});
router.get('/login', checkNotAuthenticated, function (req, res) {
    res.status(401).send('Login Here')
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')

}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next();
}
module.exports = router;