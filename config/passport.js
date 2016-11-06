var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');


module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOGIN ===================================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, email, password, done) {
            if (email)
                email = email.toLowerCase();

            process.nextTick(function () {
                User.findOne({ 'local.email': email }, function (err, user) {
                    if (err)
                        return done(err);

                    if (!user)
                        return done(null, false, req.flash('loginMessage', 'Usuario no encontrado.'));

                    if (!user.validPassword(password))
                        return done(null, false, req.flash('loginMessage', 'Contraseña incorrecta'));

                    else
                        return done(null, user);
                });
            });

        }));

    // =========================================================================
    //  SIGNUP =================================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true 
    },
        function (req, email, password, done) {
            if (email)
                email = email.toLowerCase();

            process.nextTick(function () {
                User.findOne({ 'local.email': email }, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'El email ya está en uso'));
                    } else {

                        var newUser = new User();

                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.local.admin = req.body.tipo;

                        newUser.save(function (err) {
                            if (err)
                                return done(err);

                            return done(null, false, req.flash('signupMessageOk', 'Usuario creado correctamente'));
                        });
                    }

                });
            });
        }));
};
