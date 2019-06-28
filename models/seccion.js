const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SeccionSchema = new Schema({
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
module.exports = Seccion = mongoose.model('seccion', SeccionSchema,'secciones');
