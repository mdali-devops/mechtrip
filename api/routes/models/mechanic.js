const mongoose = require('mongoose');

const mechSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phonenumber: {type: String, required: true},
    lat: {type: String, required: true},
    long: {type: String, required: true}
});

module.exports = mongoose.model('mechanic',mechSchema);