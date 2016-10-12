var mongoose = require('mongoose');

var usuarioSchema = mongoose.Schema({

    user_id: Number,
    alias: String

});

module.exports = mongoose.model('Usuario', usuarioSchema);