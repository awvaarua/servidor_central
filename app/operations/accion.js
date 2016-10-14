var TelegramBot = require('node-telegram-bot-api');
var Usuario = require('../models/usuario');
var Nodos = require('../operations/nodos');
var Ssh = require('../ssh_operations/sshoperations.js');

var actionMac = {
    start: "http://www.thecamelcase.com",
    jsFiddle: "http://www.jsfiddle.net",
    cricInfo: "http://www.cricinfo.com",
    apple: "http://www.apple.com",
    yahoo: "http://www.yahoo.com"
};

var token = '161755617:AAEkQY8R5qcMjQJAtCZ9NIiQFmJUDS_87R8';
var bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, function (msg, match) {
    AddUser(msg.from.username, msg.from.id, function (err) {
        if (err) {
            self.SendTelegram("Lo sentimos, se ha producido un error: " + err, [msg.from.username],{});
        } else {
            self.SendTelegram("Usuario añadido correctamente", [msg.from.username],{});
        }
    });
});

bot.onText(/\/estado/, function (msg, match) {
    Nodos.GetAllNodes(function(nodos){
        var keyboard = [];
        nodos.forEach(function(nodo){
            keyboard.push([{
                text: nodo.nombre +' - '+ nodo.mac,
                callback_data: "/estado "+nodo.mac
            }]);
        });
        var opt = {
            reply_markup: {
                hide_keyboard: true,
                inline_keyboard: keyboard
            }
        };
        self.SendTelegram("Selecciona un nodo",[msg.from.username], opt);
    });
});

var regex = /\/estado (.+)/;
bot.on("callback_query", function(callbackQuery) {
    var mac = callbackQuery.data.match(regex)[1]; 
    var opt = {
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id
        }
    self.UpdateMessage("\n \u{1F504} Cargando \n",opt);
    Nodos.GetNodo(mac, function(err, nodo){        
        if(err || !nodo){
            self.UpdateMessage("El nodo no se ha podido recuperar",opt);
            return;
        }
        var msg = "Información del nodo: "+nodo.nombre+"\n";
        Ssh.CheckNodeStatus(nodo.ip, function(status){
            if(status == "offline"){
                msg += "       Estado: \u{274C} Offline\n";
                self.UpdateMessage(msg,opt);
                return;
            }else{
                msg += "       Estado: \u{2705} Online\n       Lista de scripts:\n";
                //Bucle recursiu
                Ssh.CheckScriptsRecursive(nodo.ip, nodo.scripts, 0, [], function(err, info){
                    if(err){
                        self.UpdateMessage(err,opt);
                        return;
                    }
                    info.forEach(function(script){
                        if(script.estado == "offline"){
                            msg += "              "+script.nombre+" \u{274C} Parado\n";
                        }else{
                            msg += "              "+script.nombre+" \u{2705} En ejecución\n";
                        }
                    });
                    self.UpdateMessage(msg,opt);
                });
            }
        });        
    });
});

var self = module.exports = {
    SendTelegram: function (mensaje, usuarios, options) {
        usuarios.forEach(function (usuario) {
            GetUserByAlias(usuario, function (err, user) {
                if (!err && user) {
                    bot.sendMessage(user.user_id , mensaje, options);
                }
            });
        });
    },

    UpdateMessage: function (texto, options) {
        bot.editMessageText(texto, options);
    }
}

function AddUser(username, id, callback) {
    Usuario.update({
        alias: username
    }, {
            alias: username,
            user_id: id
        }, { upsert: true },
        function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
}

function GetUserByAlias(alias, callback) {
    alias = alias.replace('@', '');
    Usuario.findOne({
        alias: alias
    }, function (err, user) {
        if (err) {
            callback(err);
        }
        callback(null, user);
    });
}