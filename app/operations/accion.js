var Bot = require('node-telegram-bot');
var Usuario = require('../models/usuario');

var bot = new Bot({
    token: '161755617:AAEkQY8R5qcMjQJAtCZ9NIiQFmJUDS_87R8'
}).on('message', function (message) {
    if (message.text == "/start") {
        Usuario.update({
            alias: message.from.username
        }, {
                alias: message.from.username,
                user_id: message.from.id
            }, { upsert: true },
            function (err) {
                if (err) {
                    self.SendTelegram("Lo sentimos, se ha producido un error: " + err, [message.from.username]);
                } else {
                    self.SendTelegram("Usuario añadido correctamente", [message.from.username]);
                }
            });
    }
}).start();

var self = module.exports = {
    SendTelegram: function (mensaje, usuarios) {
        usuarios.forEach(function(usuario){
            GetUserByAlias(usuario, function (err, user) {
                if (!err && user) {
                    bot.sendMessage({
                        chat_id: user.user_id,
                        text: mensaje
                    }, function () {
                        console.log("mensaje enviado");
                    });
                }
            });
        });
    }
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