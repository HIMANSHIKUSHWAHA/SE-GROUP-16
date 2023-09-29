const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const AppError = require('../utils/AppError');


passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        //searching for email id in database or not
        if (!user) {
            return done(new AppError('Incorrect email.', 401));
        }

        const isMatch = await user.comparePassword(password);
        //error if password does not match
        if (!isMatch) {
            return done(new AppError('Incorrect password.', 401));
        }
        return done(null, user);
    } catch (error) {
        return done(new AppError(error.message, 500));
    }
}));


// Serialization - store user data in session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialization - retrieve user data from database
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(new AppError(error.message, 500));
    }
});


module.exports = passport;