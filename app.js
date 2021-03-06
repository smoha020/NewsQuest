const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
//var bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./config/passport')(passport); //for local strategy to be used
const keys = require('./config/keys');
const app = express();
const cors = require('cors');
//template engine 
//app.set('view engine', 'ejs');


//database setup
mongoose.connect(keys.MongoURI, {useNewUrlParser: true})
    .then(() => console.log('mongo connected'))
    .catch(err => console.log(err)); 

//passport 
app.use(session({ 
    secret: 'keyboard cat'
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//static files
app.use(express.static('assets'));


//body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//routes
app.use('/api/', require('./routes/index'));
app.use('/api/users/', require('./routes/users'));
app.use('/api/social/', require('./routes/social'));


if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client', 'build')));
  
  
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    });
}
/*

//flash
app.get('/flash-pass', (req, res) => {
    req.flash('log', 'Login Successful');
    res.redirect('/dashboard');
});

app.get('/flash-fail', (req, res) => {
    req.flash('log', 'Login Unsuccessful');
    res.redirect('/users/login');
});

app.get('/flash-register', (req, res) => {
    req.flash('reg', 'Input fields must be filled');
    res.redirect('/users/register');
});

app.get('/flash-exist', (req, res) => {
    req.flash('reg', 'User Exists');
    res.redirect('/users/register');
});

*/

const PORT = process.env.PORT || 5000;
app.listen(PORT); 
