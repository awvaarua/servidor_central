var Users      = require('../db_operations/users.js');
var Pendientes = require('../db_operations/pendientes.js');
var Nodos = require('../db_operations/nodos.js');
var Data = require('../db_operations/data.js');
var Ssh        = require('../ssh_operations/sshoperations.js');
var fs = require('fs');

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
        Users.GetUsers(function(err, userlist){
            if(err){}
            res.render('adminusers.ejs', {
                users : userlist
            });
        });
    });

    // UPDATE USER =========================
    app.post('/user/update', isLoggedIn, isAdmin, function(req, res) {
        Users.UpdateUser(req.body.email, req.body.tipo, function(){
            res.redirect('/users');
        });
    });

    // GESTION DE NODOS =========================
    app.get('/nodos/', isLoggedIn, function(req, res) {
        Nodos.GetAllNodes(function(nodos, err){
            if(err){}
            res.render('gestionnodos.ejs', {
                nodos : nodos
            });
        });
    });

    // NODOS PENDIENTES =========================
    app.get('/pendientes/', isLoggedIn, function(req, res) {
        Pendientes.GetPendientes(function(err, listapendientes){
            if (err) {
                listapendientes = [];
            }
            res.render('nodos-pendientes.ejs', {
                pendientes : listapendientes
            });
        });
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
    app.post('/pendiente/add', function(req, res) {        
        Pendientes.InsertPendiente(req.body.ip, function(err){
            if(err){res.send({ ok: "false", err: err});}
            res.send({ ok: "true"});
        });
    });

    // GET NODE PENDING =========================
    app.get('/pendiente/:ip', function(req, res) {        
        Pendientes.GetPendiente(req.params.ip, function(err, pendiente){
            if (err) {res.send({ ok:"false"});}
            res.send({ ok:"true", data:pendiente});
        });
    });

    // DELETE NODE PENDING =========================
    app.post('/pendiente/remove', function(req, res) {        
        Pendientes.DeletePendiente(req.body.ip, function(err){
            if (err) {res.send({ ok:"false"});}
            res.send({ ok:"true"});
        });
    });

    // NODOS CONFIRMACIÓN =========================
    app.post('/pendiente/confirmacion', function(req, res) {
        Nodos.AddNode(req.body.confirmacion.ip, function(err){
            if(err){res.send({ ok:"false", error:err});}
            Nodos.AddScripts(req.body.confirmacion.ip, req.body.confirmacion.scripts, function(err, data){
                if(err){res.send({ ok:"false", error:err});}
                Pendientes.DeletePendiente(req.body.confirmacion.ip, function(err){
                    if(err){res.send({ ok:"false", error:err});}
                    res.send({ ok:"true", data:data});
                });
            });
        });
    });

    // NODO ADD DATA ==============================
    app.post('/data/add', function(req, res) {
        Data.Add(req.body);
        res.status(200).send('Ok');        
    });

    // GET NODE =============================
    app.get('/nodo/:ip', isLoggedIn, function(req, res) {
        Nodos.GetNodo(req.params.ip, function(err, nodo){
            if (err) {}
            res.render('nodo.ejs', {
                nodo : nodo
            });
        });
    });

    // GET NODO STATUS =========================
    app.get('/nodo/:ip/status', isLoggedIn, function(req, res) {
        Ssh.CheckNodeStatus(req.params.ip, function(status){
            res.send({ status:status });
        });
    });

    // DELETE NODE =========================
    app.post('/nodo/:ip/delete', isLoggedIn, function(req, res) {
        Nodos.DeleteNodo(req.params.ip, function(err){
            if (err) {res.send({ ok:"false", error: err});}
            res.send({ ok:"true" });
        });
    });

    // RESTART NODE =========================
    app.post('/nodo/:ip/restart', isLoggedIn, function(req, res) {
        Ssh.RestartNode(req.params.ip, function(err){
            if (err) {res.send({ ok:"false", error: err});}
            res.send({ ok:"true" });
        });
    });

    // GET ALL SCRIPTS ABOUT NODE =========================
    app.get('/nodo/:ip/scripts', function(req, res) {
        Nodos.GetNodo(req.params.ip, function(err, nodo){
            if (err) {res.send({ok:"false"});}
            res.send({ok:"true", data:nodo});
        });
    });

    // GET NODE SCRIPT STATUS =========================
    app.get('/nodo/:ip/script/:pid/status', isLoggedIn, function(req, res) {
        Ssh.CheckScriptStatus(req.params.ip, req.params.pid, function(err, status){            
            if(err){res.send({ status:"offline", error:error});}            
            res.send({ status : status });
        });
    });

    // NODE SCRIPT DELETE =========================
    app.post('/nodo/:ip/script/:pid/delete', isLoggedIn, function(req, res) {
        Nodos.DeleteScript(req.params.ip, req.params.pid, function(err){
            if (err) {
                res.send({ ok:"false", message:err});
            }
            res.send({ ok:"true"});
        });
    });

// =============================================================================
// PUBLIC IMAGES ===============================================================
// =============================================================================    
    // RETURN IMAGE =========================
    app.get('/public/img/:name', function(req, res) {        
        var img = fs.readFileSync('./public/img/'+req.params.name);
        res.writeHead(200, {'Content-Type': 'image/gif' });
        res.end(img, 'binary');
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

    // local -----------------------------------
    app.post('/user/unlink', isLoggedIn, isAdmin, function(req, res) {
        Users.DeleteUserByEmail(req.body.email, function(err){
            if (err) {}
            res.redirect('/users');
        });
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