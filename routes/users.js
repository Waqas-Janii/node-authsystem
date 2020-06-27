var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
const initializePassport = require('../config/passport.config')
initializePassport(
    passport,
    User.getUserByEmail,
    User.getUserById
)
const Joi = require('@hapi/joi');
const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{3,30}$/),
    confirm_password: Joi.ref('password'),

})
// Register User
router.post('/register', async (req, res) => {
    // validate the request data against the schema
    try {
        const value = await schema.validateAsync(req.body);
        User.findOne({ email: value.email }, (err, email) => {
            if (err) {
                res.status(500).json({
                    status: 500,
                    message: 'Something went wrong',
                });
            } else if (email) {
                res.status(422).json({
                    status: 422,
                    message: 'Duplicate email not allow',
                });
            } else {
                var newUser = new User({
                    username: value.username,
                    email: value.email,
                    password: value.password
                });
                User.createUser(newUser, function (err, user) {
                    if (err) throw err;
                    res.status(200).json({
                        status: 200,
                        message: 'User created successfully',
                        data: user
                    });
                });
            }
        })
    }
    catch (err) {
        res.status(400).json({
            status: 400,
            message: err.details[0].message,
            detail: 'Invalid parameters'
        });
    }
});
// User.getUserByUsername(username, function (err, user) {
//     if (err) throw err;
//     if (!user) {
//         return done(null, false, { message: 'Unknown User' });
//     }
//     User.comparePassword(password, user.password, function (err, isMatch) {
//         if (err) throw err;
//         if (isMatch) {
//             return done(null, user);
//         }
//         else {
//             return done(null, false, { message: 'inValid Password' })
//         }
//     });

// });
// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password'
// },
//     function (email, password, done) {
//         User.getUserByEmail(email, function (err, user) {
//             if (err) throw err;
//             if (!user) {
//                 return done(null, false, { message: 'Unknown User' });
//             }
//             User.comparePassword(password, user.password, function (err, isMatch) {
//                 if (err) throw err;
//                 if (isMatch) {
//                     return done(null, user);
//                 }
//                 else {
//                     return done(null, false, { message: 'inValid Password' })
//                 }
//             });
//         });
//     }
// ));
// passport.serializeUser(function (user, done) {
//     done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//     User.getUserById(id, function (err, user) {
//         done(err, user);
//     });
// });
// Login
router.post('/login', checkNotAuthenticated,
    passport.authenticate('local', { failureFlash: true }),
    function (req, res) {
        res.status(200).json({
            user: req.user,
        })
    });
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next();
}
router.get('/logout', function (req, res) {
    if (req.user) {
        req.logout();
        res.status(200).json({
            message: 'Success'
        })
    } else {
        res.status(401).json({
            message: 'User does not exist'
        })
    }
});
//Check user existence from client side
router.get('/check', (req, res) => {
    if (req.user) {
        res.status(200).json({
            user: true
        })
    } else {
        res.status(401).json({
            user: false
        })
    }
});
module.exports = router;