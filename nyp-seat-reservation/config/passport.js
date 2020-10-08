const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/Users');

function localStrategy(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
        User.findOne({ where: { email: email.toLowerCase() }}).then(user => {
            console.log("user", user);
            if (!user) {
                return done(null, false, { message: 'Please enter a valid email address' });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Please enter the correct password' })
                }
            })
        })
    }));

    passport.serializeUser((user, done) => { done(null, user.id); }); 

    passport.deserializeUser((userId, done) => {
        User.findOne({ where: { id: userId }})
        .then((user) => {
            done(null, user);
        })
        .catch((done) => {
            //console.log(done);
        });
    });
}

module.exports = { localStrategy }; 