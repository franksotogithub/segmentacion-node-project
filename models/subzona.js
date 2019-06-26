const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SubZonaSchema = new Schema({
    ccdi: String,
    idzona: String,
    idsubzona: String,
    idseccion: String,
    zona :String,
    subzona: String,
    seccion: String,
    cant_viv: Number,
    ruta_web: String

});
module.exports = SubZona = mongoose.model('subzona', SubZonaSchema);