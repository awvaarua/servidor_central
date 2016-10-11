var Users      = require('../db_operations/users.js');
module.exports = function(app, passport) {

// =============================================================================
// NORMAL ROUTES ==================================================
// =============================================================================

    // PROFILE SECTION =========================
    app.get('/', isLoggedIn, function(req, res) {
        res.render('index.ejs', {
            user : req.user
        });
    });

    // PROFILE SECTION =========================
    app.get('/admin', isLoggedIn, function(req, res) {
        res.render('index.ejs', {
            user : req.user
        });
    });

    // USERS ADMIN =========================
    app.get('/users', isLoggedIn, isAdmin, function(req, res) {
        Users.GetUsers(res);
    });

    // UPDATE USER =========================
    app.post('/user/update', isLoggedIn, isAdmin, function(req, res) {
        Users.UpdateUser(res, req.body.email, req.body.tipo);
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/admin', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', isLoggedIn, isAdmin, function(req, res) {            
        res.render('signup.ejs', { message: req.flash('signupMessage'), messageOk: req.flash('signupMessageOk') });
    });

    // process the signup form
    app.post('/signup', isLoggedIn, isAdmin, passport.authenticate('local-signup', {
        successRedirect : '/user/success', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.post('/user/unlink', isLoggedIn, isAdmin, function(req, res) {
        Users.DeleteUserByEmail(res, req.body.email);
    });

};


// =============================================================================
// MIDDLEWARE ==================================================================
// =============================================================================
// Funciones que se ejecutarán antes que la lógica
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}

function isAdmin(req, res, next) {
    console.log(req.user.local.admin);
    if (req.user.local.admin == true){
        return next();
    }
    res.redirect('/login');
}
