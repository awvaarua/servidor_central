module.exports = function(app, passport) {

    var md = require('./middleware/middleware');

    var users = require('./routes/users');
    app.get('/users', md.isLoggedIn, md.isAdmin, users.users);
    app.post('/user/update', md.isLoggedIn, md.isAdmin, users.userUpdate);
    app.post('/user/unlink', md.isLoggedIn, md.isAdmin, users.userDelete);

    var pendientes = require('./routes/pendientes');
    app.post('/pendiente/add', md.isLoggedIn, pendientes.pendienteAdd);
    app.get('/pendiente/:ip', md.isLoggedIn, pendientes.pendiente);
    app.post('/pendiente/remove', md.isLoggedIn, pendientes.pendienteDelete);
    app.get('/pendientes/', md.isLoggedIn, pendientes.pendientes);

    var nodes = require('./routes/nodos');
    app.post('/nodo/add', md.isLoggedIn, nodes.nodeAdd);
    app.get('/nodo/:ip', md.isLoggedIn, nodes.node);
    app.get('/nodos/', md.isLoggedIn, nodes.nodes);
    app.get('/nodo/:ip/status', md.isLoggedIn, nodes.nodeStatus);
    app.post('/nodo/:ip/delete', md.isLoggedIn, nodes.nodeDelete);
    app.post('/nodo/:ip/restart', md.isLoggedIn, nodes.nodeRestart);
    app.get('/nodo/:ip/scripts', md.isLoggedIn, nodes.nodeScripts);
    app.get('/nodo/:ip/script/:pid/status', md.isLoggedIn, nodes.scriptStatus);
    app.post('/nodo/:ip/script/:pid/delete', md.isLoggedIn, nodes.scriptDelete);

    var data = require('./routes/data');
    app.post('/data/add', data.dataAdd);

    // =============================================================================
    //  ADMIN PANE =================================================================
    // =============================================================================

    app.get('/', md.isLoggedIn, function(req, res) {
        res.render('index.ejs', {
            user: req.user
        });
    });

    app.get('/admin', md.isLoggedIn, function(req, res) {
        res.render('index.ejs', {
            user: req.user
        });
    });

    // =============================================================================
    // PUBLIC IMAGES ===============================================================
    // =============================================================================    
    // RETURN IMAGE =========================
    var fs = require('fs');
    app.get('/public/img/:name', function(req, res) {
        var img = fs.readFileSync('./public/img/' + req.params.name);
        res.writeHead(200, {
            'Content-Type': 'image/gif'
        });
        res.end(img, 'binary');
    });

    // =============================================================================
    // AUTHENTICATE ================================================================
    // =============================================================================

    // LOGIN ===============================
    app.get('/login', function(req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // LOGIN SEND =================================
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/admin', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP =================================
    app.get('/signup', md.isLoggedIn, md.isAdmin, function(req, res) {
        res.render('signup.ejs', {
            message: req.flash('signupMessage'),
            messageOk: req.flash('signupMessageOk')
        });
    });

    // SIGNUP SEND =================================
    app.post('/signup', md.isLoggedIn, md.isAdmin, passport.authenticate('local-signup', {
        successRedirect: '/user/success', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // LOGOUT =================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

};