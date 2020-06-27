require('dotenv').config();
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken');
// Cors middleware
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Body parser
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
const posts = [
    {
        name: 'Waqas',
        content: 'This is the post.'
    },
    {
        name: 'Ali',
        content: 'This is the post.'
    },
]

app.get('/post', authenticateToken, (req, res) => {
    console.log('USER', req.user)
    res.json(posts.filter(post => post.name === req.user.name))
});
app.post('/login', (req, res) => {
    const userName = req.body.userName;
    const user = { name: userName }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken })
});
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
var port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}!`))
