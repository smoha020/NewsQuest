const allUsers = require('../Models/allUsers');
const passport = require('passport')
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = function (passport) {

    passport.use(new LocalStrategy({
        usernameField: 'email',
        },
        (email, password, done) => { 
            allUsers.findOne({ email: email})
                .then(user => {
                    if (!user) {
                        console.log('user doesnt exist');
                        return done(null, false, {message: 'User does not exist'});
                    } 
                    //with out this, the user can log in with any psswrd as long as username is correct
                    bcrypt.compare(password, user.password)
                        .then((result) => {
                            if(result == false) {
                                console.log('incorrect password');
                                return done(null, false, {message: 'incorrect Password'});
                            } else {
                                console.log('welcome');
                                return done(null, user);
                            }
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err))
        }
    ))

    //cannot log in with out this
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        allUsers.findById(id)
            .then(user => done(null, user))
    });
}


