const LocalStrategy     = require('passport-local').Strategy;

const user              = require('../app/models/user');

module.exports = (passport) => {

    // --- Passport setup ---

    //Serielize user for the session
    passport.serializeUser((user,done) => {
        done(null, user.id);
    });

    //Deserialize the user
    passport.deserializeUser((id, done) => {
        User.findById(id,(err, user) => {
            done(err, user);
        });
    });

    // --- Local signup ---

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    (req, email, password, done) => {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(() => {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, (err, user) => {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                let newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save((err) => {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

};