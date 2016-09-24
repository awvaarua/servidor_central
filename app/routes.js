var Users      = require('../db_operations/users.js');
var Pendientes = require('../db_operations/pendientes.js');
var Ssh        = require('../ssh_operations/init-node.js');
module.exports = function(app, passport) {

// =============================================================================
//  ADMIN PANE =================================================================
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

    // NODOS PENDIENTES =========================
    app.get('/nodos/pendientes', isLoggedIn, function(req, res) {
        Pendientes.GetPendientes(res);
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

// =============================================================================
// API =========================================================================
// =============================================================================    
    // RECIVE NEW CONECTION FROM SOME NODE =========================
    app.post('/nodo/pendiente', function(req, res) {        
        Pendientes.InsertPendiente(res, req.body.ip, req.body.date);
    });

    // DELETE NODE PENDING =========================
    app.post('/nodo/remove', function(req, res) {        
        Pendientes.DeletePendiente(res, req.body.ip);
    });

    // NODOS CONFIRMACIÓN =========================
    app.post('/nodos/confirmacion', function(req, res) {
        var error = [];
        req.body.confirmacion.scripts.forEach(function(value){
      console.log(value);
          error.push(Ssh.Init(value.tipo,value.frec, value.ip));
        });
        error.forEach(function(value){
            if (value != 0) {
                res.status(500).send('Se ha producido un error. Consultar log servidor.');
                return;
            }
        });
        res.status(200).send('Ok');
    });

    // NODO ADD DATA ==============================
    app.post('/nodos/data/add', function(req, res) {
        res.status(200).send('Ok');
        console.log(req.body);
        
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
    if (req.user.local.admin == true){
        return next();
    }
    res.redirect('/login');
}