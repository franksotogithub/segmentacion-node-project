const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AeuSchema = new Schema({
    ccdi: String,
    idzona: String,
    idsubzona: String,
    idseccion: String,
    idaeu: String,
    zona :String,
    subzona: String,
    seccion: String,
    aeu: String,
    cant_viv: Number,
    ruta_web: String,
    flag_calidad: Number,

});
module.exports = Aeu = mongoose.model('aeu', AeuSchema);