var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

    ip : String,
    date: Date,
    scripts: [{pid: Number, tipo: String, frec: Number}]

});

// create the model for users
module.exports = mongoose.model('Nodo', userSchema);
