
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const flash = require('../utils/flash');

const User = require('../models/User');

function localStrategy(passport) {
    passport.use(new LocalStrategy({ 
        usernameField: 'email', 
        passwordField: 'password', 
        passReqToCallback: true 
    }, async (req, email, password, done) => {
        try {
            let user = await User.findOne({ 
                where: { email: email.toLocaleLowerCase() },
            });
    
            if (!user) {
                return done(null, false, { message: flash.error(req, "Please enter a valid email address!") });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
    
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: flash.error(req, "Please enter the correct password!") });
            }
            
        } catch (error) {
            console.error(error);
            return done(null, false, { message: flash.error(req, "Something went wrong while signing you in. Please try again later!") });
        }
    }));

    passport.serializeUser((user, done) => { 
        done(null, user.id); 
    }); 

    passport.deserializeUser((userId, done) => {
        User.findOne({ where: { id: userId }}).then((user) => {
            done(null, user);
        }).catch((done) => {
            console.error(done);
        });
    });
}

module.exports = { localStrategy }; 