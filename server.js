const express = require('express')
var path = require('path');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
const app = express()
const config = require('./config/database');
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true, });
var users = require('./routes/users');
var home = require('./routes/home');
var post = require('./routes/post')
let Post = require('./models/post');
let db = mongoose.connection;
// Check connections
db.once('open', async () => {
  if (await Post.countDocuments().exec() > 0) {
    return
  }
  Promise.all([
    Post.create({ name: 'Name 1', content: 'This is my post' }),
    Post.create({ name: 'Name 2', content: 'This is my post' }),
    Post.create({ name: 'Name 3', content: 'This is my post' }),
    Post.create({ name: 'Name 4', content: 'This is my post' }),
    Post.create({ name: 'Name 5', content: 'This is my post' }),
    Post.create({ name: 'Name 6', content: 'This is my post' }),
    Post.create({ name: 'Name 7', content: 'This is my post' }),
    Post.create({ name: 'Name 8', content: 'This is my post' }),
    Post.create({ name: 'Name 9', content: 'This is my post' }),
    Post.create({ name: 'Name 10', content: 'This is my post' }),
    Post.create({ name: 'Name 11', content: 'This is my post' }),
    Post.create({ name: 'Name 12', content: 'This is my post' }),
    Post.create({ name: 'Name 13', content: 'This is my post' }),
    Post.create({ name: 'Name 14', content: 'This is my post' }),
    Post.create({ name: 'Name 15', content: 'This is my post' }),
    Post.create({ name: 'Name 16', content: 'This is my post' }),
  ]).then(res => console.log('ADDED...'))
});
// Check for error
db.on('error', function (err) {
  console.log(err);
});
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

//cookies parser
app.use(cookieParser());
// Set Static Folder
app.use(express.static(path.join(__dirname, 'build')));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
//Express flash
app.use(flash());
// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  resave: false
}));
// Passport init
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/', home);
app.use('/user', users);
app.use('/post', post);
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
var port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}!`))
//   "client-install": "cd client && npm install",
  //   "start": "node server.js",
  //   "server": "nodemon server.js",
  //   "client": "npm start --prefix client",
  //   "dev": "concurrently \"npm run server\" \"npm run client\""