var mongoose = require('mongoose');

var googleDataSchema = mongoose.Schema({
    placeid: {type: String},
    data: {type: Object}
});

const GoogleData = mongoose.model('googleData', googleDataSchema);

module.exports = GoogleData;
