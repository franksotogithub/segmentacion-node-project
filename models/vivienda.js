const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ViviendaSchema = new Schema({
    ccdi: String,
    zona :String,
    aeu: String,
});
module.exports = Aeu = mongoose.model('vivienda', ViviendaSchema);