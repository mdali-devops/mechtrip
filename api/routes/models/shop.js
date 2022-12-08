const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    cartype: {type: String, required:true},
    brand: {type:String, required: true},
    model: {type:String, required: true},
    year: {type:String, required: true},
    vin_number: {type:String, required: true}
});

module.exports = mongoose.model('Car',carSchema);