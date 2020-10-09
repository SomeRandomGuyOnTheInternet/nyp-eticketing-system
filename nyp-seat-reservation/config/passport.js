const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const flash = require('../utils/flash');

const User = require('../models/User');

function localStrategy(passport) {
    passport.use(new LocalStrategy({ 
        usernameField: 'email', 
        passwordField: 'password', 
        passReqToCallback: true 
    },(req, email, password, done) => {
        User.findOne({ 
            where: { 
                email: email.toLowerCase() 
            }
        }).then(user => {
            if (!user) {
                return done(null, false, { message: flash.error(req, "Please enter a valid email address!") });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: flash.error(req, "Please enter the correct password!") })
                }
            });
        });
    }));

    passport.serializeUser((user, done) => { 
        done(null, user.id); 
    }); 

    passport.deserializeUser((userId, done) => {
        User.findOne({ where: { id: userId }}).then((user) => {
            done(null, user);
        }).catch((done) => {
            console.log(done);
        });
    });
}

module.exports = { localStrategy }; 